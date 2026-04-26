"""
TruthLens Database Layer — Hybrid Implementation
=================================================
Auto-detects Firebase credentials. If found, uses Cloud Firestore.
If not found, falls back to local SQLite with zero startup delay.

To enable Cloud mode: place 'serviceAccountKey.json' in this directory.
"""

import os
import sqlite3
import logging
import traceback
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── paths ─────────────────────────────────────────────────────────────────────
DB_PATH     = os.path.join(os.path.dirname(__file__), "truthlens.db")
SA_KEY_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")

# ── mode flag ─────────────────────────────────────────────────────────────────
USE_FIREBASE = False
_db_cloud    = None    # Firestore client; only set when USE_FIREBASE is True

# ── lazy Firebase initialisation ─────────────────────────────────────────────
def _try_init_firebase():
    """Only import & init firebase if credentials are present. No network if not."""
    global USE_FIREBASE, _db_cloud

    has_key = os.path.exists(SA_KEY_PATH)
    has_adc = bool(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))

    if not has_key and not has_adc:
        logger.warning("⚠️  DB MODE: LOCAL SQLITE — place serviceAccountKey.json to enable Cloud.")
        return

    try:
        # Deferred import — keeps gRPC from loading at module import time
        import firebase_admin
        from firebase_admin import credentials, firestore as fs

        if not firebase_admin._apps:
            cred = credentials.Certificate(SA_KEY_PATH) if has_key else credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)

        _db_cloud = fs.client()
        USE_FIREBASE = True
        logger.info("🚀 DB MODE: FIREBASE CLOUD (Production)")
    except Exception as exc:
        logger.error(f"❌ Firebase init FAILED — falling back to SQLite.")
        logger.error(f"   Reason: {exc}")
        logger.error(traceback.format_exc())
        USE_FIREBASE = False

_try_init_firebase()


# ── SQLite helper ─────────────────────────────────────────────────────────────
def _sql():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


# ── Schema / seed ─────────────────────────────────────────────────────────────
def init_db():
    if USE_FIREBASE:
        docs = _db_cloud.collection("regional_bias").limit(1).get()
        if len(docs) == 0:
            _seed_firestore_regions()
    else:
        _init_sqlite()

def _init_sqlite():
    conn = _sql()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS analyzed_articles (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         TEXT,
            headline        TEXT,
            source          TEXT    NOT NULL DEFAULT 'unknown',
            topic           TEXT    NOT NULL DEFAULT 'General',
            bias_score      REAL    NOT NULL,
            linguistic_bias REAL    NOT NULL DEFAULT 0,
            framing_bias    REAL    NOT NULL DEFAULT 0,
            entity_bias     REAL    NOT NULL DEFAULT 0,
            bias_level      TEXT    NOT NULL DEFAULT 'Low Bias',
            sentiment       TEXT    NOT NULL DEFAULT 'Neutral',
            region          TEXT    NOT NULL DEFAULT 'Unknown',
            timestamp       TEXT    NOT NULL
        );
        CREATE TABLE IF NOT EXISTS regional_bias (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            region          TEXT    NOT NULL UNIQUE,
            bias_index      REAL    NOT NULL DEFAULT 0,
            archive_packets INTEGER NOT NULL DEFAULT 0
        );
    """)
    if conn.execute("SELECT COUNT(*) FROM regional_bias").fetchone()[0] == 0:
        regions = [("North America",0,0),("Europe",0,0),("Asia Pacific",0,0),
                   ("Middle East",0,0),("Africa",0,0),("Latin America",0,0)]
        conn.executemany(
            "INSERT INTO regional_bias (region, bias_index, archive_packets) VALUES (?,?,?)", regions)
    conn.commit()
    conn.close()

def _seed_firestore_regions():
    from firebase_admin import firestore as fs
    default = ["North America","Europe","Asia Pacific","Middle East","Africa","Latin America"]
    batch = _db_cloud.batch()
    for r in default:
        batch.set(_db_cloud.collection("regional_bias").document(r),
                  {"region": r, "bias_index": 0.0, "archive_packets": 0})
    batch.commit()


# ── Heuristic classifiers ─────────────────────────────────────────────────────
def _detect_topic(headline: str, text: str) -> str:
    combined = (headline + " " + text).lower()
    topics = {
        "Politics":      ["president","government","election","congress","senate","policy","political","democrat","republican","vote","parliament"],
        "Economy":       ["economy","market","stock","trade","inflation","gdp","finance","bank","investment","recession"],
        "Technology":    ["tech","ai ","artificial intelligence","software","google","apple","microsoft","startup","cyber","digital","algorithm"],
        "Health":        ["health","medical","vaccine","disease","hospital","doctor","treatment","pandemic","virus","clinical"],
        "Sports":        ["sport","game","team","player","tournament","championship","match","athlete","league"],
        "Science":       ["science","research","study","discovery","nasa","space","climate","environment","physics","biology"],
        "Entertainment": ["movie","film","music","celebrity","entertainment","actor","singer","album","show","concert"],
        "World":         ["war","conflict","military","nato","united nations","refugee","diplomacy","crisis","international"],
    }
    for t, kws in topics.items():
        if any(k in combined for k in kws):
            return t
    return "General"

def _detect_region(source: str, text: str) -> str:
    combined = (source + " " + text).lower()
    rm = {
        "North America": ["cnn","fox","nbc","abc news","usa","united states","america","washington","new york","canada","nytimes","ap news"],
        "Europe":        ["bbc","guardian","reuters","france","germany","uk ","london","paris","eu ","european","spiegel","le monde"],
        "Asia Pacific":  ["asia","china","japan","india","korea","australia","pacific","beijing","tokyo","scmp","times of india"],
        "Middle East":   ["middle east","iran","iraq","saudi","israel","palestine","al jazeera","dubai","qatar"],
        "Africa":        ["africa","kenya","nigeria","south africa","egypt","ethiopia","ghana"],
        "Latin America": ["brazil","mexico","argentina","latin america","colombia","chile","latin"],
    }
    for r, kws in rm.items():
        if any(k in combined for k in kws):
            return r
    return "Unknown"

def _detect_sentiment(score: float, level: str) -> str:
    if score < 30: return "Positive"
    if score < 60: return "Neutral"
    return "Negative"


# ── Write ─────────────────────────────────────────────────────────────────────
def save_analysis(article: dict, result: dict, user_id: str = None):
    headline    = result.get("headline") or article.get("headline") or "Untitled"
    source      = result.get("source")   or article.get("source")   or "unknown"
    text        = article.get("text", "")
    bias_score  = float(result.get("bias_score", 0))
    bias_level  = result.get("bias_level", "Low Bias")
    topic       = _detect_topic(headline, text)
    region      = _detect_region(source, text)
    sentiment   = _detect_sentiment(bias_score, bias_level)
    now         = datetime.now(timezone.utc)

    if USE_FIREBASE:
        from firebase_admin import firestore as fs
        _db_cloud.collection("analyzed_articles").add({
            "user_id": user_id,
            "headline": headline, "source": source, "topic": topic,
            "bias_score": bias_score,
            "linguistic_bias": float(result.get("linguistic_bias", 0)),
            "framing_bias":    float(result.get("framing_bias", 0)),
            "entity_bias":     float(result.get("entity_bias", 0)),
            "bias_level": bias_level, "sentiment": sentiment, "region": region,
            "timestamp": now,
        })

        @fs.transactional
        def _upd(txn, ref, score):
            snap = ref.get(transaction=txn)
            if snap.exists:
                d   = snap.to_dict()
                cnt = d.get("archive_packets", 0) + 1
                avg = (d.get("bias_index", 0.0) * (cnt - 1) + score) / cnt
                txn.update(ref, {"bias_index": float(avg), "archive_packets": cnt})
            else:
                txn.set(ref, {"region": region, "bias_index": float(score), "archive_packets": 1})

        _upd(_db_cloud.transaction(),
             _db_cloud.collection("regional_bias").document(region),
             bias_score)
    else:
        conn = _sql()
        conn.execute("""
            INSERT INTO analyzed_articles
              (user_id,headline,source,topic,bias_score,linguistic_bias,framing_bias,entity_bias,bias_level,sentiment,region,timestamp)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        """, (user_id, headline, source, topic, bias_score,
              result.get("linguistic_bias",0), result.get("framing_bias",0), result.get("entity_bias",0),
              bias_level, sentiment, region, now.isoformat()))
        conn.execute("""
            INSERT INTO regional_bias (region,bias_index,archive_packets) VALUES (?,?,1)
            ON CONFLICT(region) DO UPDATE SET
                bias_index = (regional_bias.bias_index*regional_bias.archive_packets + ?) /
                             (regional_bias.archive_packets + 1),
                archive_packets = regional_bias.archive_packets + 1
        """, (region, bias_score, bias_score))
        conn.commit()
        conn.close()


# ── Read ──────────────────────────────────────────────────────────────────────
def get_overview_stats(user_id: str = None) -> dict:
    if USE_FIREBASE:
        query = _db_cloud.collection("analyzed_articles")
        if user_id:
            query = query.where("user_id", "==", user_id)
        docs  = query.get()
        total = len(docs)
        if total == 0:
            return {"total_articles":0,"avg_bias_score":0,"active_sources":0,"articles_per_hour":0,"last_updated":None}
        sb, sources, last_ts = 0, set(), None
        articles_per_hour = 0
        now_utc = datetime.now(timezone.utc)
        for d in docs:
            dd = d.to_dict()
            sb += dd.get("bias_score", 0)
            sources.add(dd.get("source"))
            ts = dd.get("timestamp")
            if not last_ts or (ts and ts > last_ts): last_ts = ts
            if ts and isinstance(ts, datetime):
                # Ensure timezone aware
                if ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                if (now_utc - ts).total_seconds() <= 3600:
                    articles_per_hour += 1
        return {"total_articles": total, "avg_bias_score": round(sb/total,2),
                "active_sources": len(sources), "articles_per_hour": articles_per_hour,
                "last_updated": last_ts.isoformat() if hasattr(last_ts, "isoformat") else str(last_ts) if last_ts else None}
    else:
        conn = _sql()
        where_clause = "WHERE user_id = ?" if user_id else ""
        params = (user_id,) if user_id else ()
        
        row  = conn.execute(f"SELECT COUNT(*) as total, AVG(bias_score) as avg, MAX(timestamp) as lu FROM analyzed_articles {where_clause}", params).fetchone()
        srcs = conn.execute(f"SELECT COUNT(DISTINCT source) FROM analyzed_articles {where_clause}", params).fetchone()[0]
        
        recent_query = f"SELECT COUNT(*) FROM analyzed_articles WHERE timestamp >= datetime('now', '-1 hour')"
        if user_id:
            recent_query += " AND user_id = ?"
        recent = conn.execute(recent_query, params).fetchone()[0]
        
        conn.close()
        return {"total_articles": row["total"] or 0, "avg_bias_score": round(row["avg"] or 0,2),
                "active_sources": srcs or 0, "articles_per_hour": recent or 0, "last_updated": row["lu"]}


def get_bias_timeseries(days: int = 30, user_id: str = None) -> list:
    if USE_FIREBASE:
        query = _db_cloud.collection("analyzed_articles")
        if user_id:
            query = query.where("user_id", "==", user_id)
        docs, daily = query.order_by("timestamp").get(), {}
        for d in docs:
            dd = d.to_dict(); ts = dd.get("timestamp")
            if not ts: continue
            ds = ts.strftime("%Y-%m-%d")
            if ds not in daily: daily[ds] = {"s":0,"c":0}
            daily[ds]["s"] += dd.get("bias_score",0); daily[ds]["c"] += 1
        return [{"date":k,"average_bias":round(v["s"]/v["c"],2),"article_count":v["c"]} for k,v in sorted(daily.items())]
    else:
        conn = _sql()
        where_clause = "WHERE timestamp >= datetime('now', ? || ' days')"
        params = [f"-{days}"]
        if user_id:
            where_clause += " AND user_id = ?"
            params.append(user_id)
            
        rows = conn.execute(f"""
            SELECT DATE(timestamp) as date, AVG(bias_score) as average_bias, COUNT(*) as article_count
            FROM analyzed_articles
            {where_clause}
            GROUP BY DATE(timestamp) ORDER BY date ASC
        """, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]


def get_narrative_balance(user_id: str = None) -> dict:
    if USE_FIREBASE:
        query = _db_cloud.collection("analyzed_articles")
        if user_id:
            query = query.where("user_id", "==", user_id)
        docs = query.get()
        total = len(docs)
        if total == 0: return {"neutral":0,"left_leaning":0,"right_leaning":0,"total":0}
        n=l=r=0
        for d in docs:
            s = d.to_dict().get("bias_score",0)
            if s < 35: n+=1
            elif s < 60: l+=1
            else: r+=1
        return {"neutral":round(n/total*100,1),"left_leaning":round(l/total*100,1),"right_leaning":round(r/total*100,1),"total":total}
    else:
        conn  = _sql()
        where_clause = "WHERE user_id = ?" if user_id else ""
        params = (user_id,) if user_id else ()
        
        total = conn.execute(f"SELECT COUNT(*) FROM analyzed_articles {where_clause}", params).fetchone()[0] or 1
        
        n_query = "SELECT COUNT(*) FROM analyzed_articles WHERE bias_score < 35"
        l_query = "SELECT COUNT(*) FROM analyzed_articles WHERE bias_score>=35 AND bias_score<60"
        r_query = "SELECT COUNT(*) FROM analyzed_articles WHERE bias_score>=60"
        
        if user_id:
            n_query += " AND user_id = ?"
            l_query += " AND user_id = ?"
            r_query += " AND user_id = ?"
            
        n = conn.execute(n_query, params).fetchone()[0]
        l = conn.execute(l_query, params).fetchone()[0]
        r = conn.execute(r_query, params).fetchone()[0]
        
        conn.close()
        return {"neutral":round(n/total*100,1),"left_leaning":round(l/total*100,1),"right_leaning":round(r/total*100,1),"total":total}


def get_recent_articles(limit: int = 10, user_id: str = None) -> list:
    if USE_FIREBASE:
        from firebase_admin import firestore as fs
        query = _db_cloud.collection("analyzed_articles")
        if user_id:
            query = query.where("user_id", "==", user_id)
        docs = query.order_by("timestamp",direction=fs.Query.DESCENDING).limit(limit).get()
        out = []
        for d in docs:
            dd = d.to_dict(); dd["id"] = d.id
            if dd.get("timestamp"): dd["timestamp"] = dd["timestamp"].isoformat()
            out.append(dd)
        return out
    else:
        conn = _sql()
        where_clause = "WHERE user_id = ?" if user_id else ""
        limit = 100
        params = (user_id, limit) if user_id else (limit,)
        if user_id:
            params = (user_id, limit)
            
        rows = conn.execute(f"SELECT * FROM analyzed_articles {where_clause} ORDER BY id DESC LIMIT ?", params).fetchall()
        conn.close()
        return [dict(r) for r in rows]


def get_regional_bias() -> list:
    if USE_FIREBASE:
        from firebase_admin import firestore as fs
        docs = _db_cloud.collection("regional_bias").order_by("archive_packets",direction=fs.Query.DESCENDING).get()
        return [d.to_dict() for d in docs]
    else:
        conn = _sql()
        rows = conn.execute("SELECT region, ROUND(bias_index,2) as bias_index, archive_packets FROM regional_bias ORDER BY archive_packets DESC").fetchall()
        conn.close()
        return [dict(r) for r in rows]


def get_bias_distribution(user_id: str = None) -> dict:
    if USE_FIREBASE:
        query = _db_cloud.collection("analyzed_articles")
        if user_id:
            query = query.where("user_id", "==", user_id)
        docs = query.get()
        lo=mo=hi=0
        for d in docs:
            s = d.to_dict().get("bias_score",0)
            if s < 35: lo+=1
            elif s < 60: mo+=1
            else: hi+=1
        return {"low_bias":lo,"moderate_bias":mo,"high_bias":hi}
    else:
        conn = _sql()
        where_clause = "WHERE user_id = ?" if user_id else ""
        params = (user_id,) if user_id else ()
        
        lo_query = "SELECT COUNT(*) FROM analyzed_articles WHERE bias_score<35"
        mo_query = "SELECT COUNT(*) FROM analyzed_articles WHERE bias_score>=35 AND bias_score<60"
        hi_query = "SELECT COUNT(*) FROM analyzed_articles WHERE bias_score>=60"
        
        if user_id:
            lo_query += " AND user_id = ?"
            mo_query += " AND user_id = ?"
            hi_query += " AND user_id = ?"
            
        lo = conn.execute(lo_query, params).fetchone()[0]
        mo = conn.execute(mo_query, params).fetchone()[0]
        hi = conn.execute(hi_query, params).fetchone()[0]
        conn.close()
        return {"low_bias":lo,"moderate_bias":mo,"high_bias":hi}


def get_sentiment_correlation(user_id: str = None) -> list:
    SM = {"Positive":0.6,"Neutral":0.0,"Negative":-0.6}
    if USE_FIREBASE:
        from firebase_admin import firestore as fs
        query = _db_cloud.collection("analyzed_articles")
        if user_id:
            query = query.where("user_id", "==", user_id)
        docs = query.order_by("timestamp",direction=fs.Query.DESCENDING).limit(100).get()
        out = []
        for d in docs:
            r = d.to_dict()
            b  = (r.get("bias_score",50)-50)/50
            sv = SM.get(r.get("sentiment"),0) + (r.get("linguistic_bias",0)-r.get("framing_bias",0))*0.02
            out.append({"bias":round(b,2),"sentiment":round(sv,2),"size":max(10,min(40,int(r.get("bias_score",0)/3)))})
        return out
    else:
        conn = _sql()
        where_clause = "WHERE user_id = ?" if user_id else ""
        limit = 100
        params = (user_id, limit) if user_id else (limit,)
            
        rows = conn.execute(f"SELECT bias_score,linguistic_bias,framing_bias,sentiment FROM analyzed_articles {where_clause} ORDER BY id DESC LIMIT ?", params).fetchall()
        conn.close()
        out = []
        for r in rows:
            b  = (r["bias_score"]-50)/50
            sv = SM.get(r["sentiment"],0) + (r["linguistic_bias"]-r["framing_bias"])*0.02
            out.append({"bias":round(b,2),"sentiment":round(sv,2),"size":max(10,min(40,int(r["bias_score"]/3)))})
        return out


# ── Migration helper ─────────────────────────────────────────────────────────
def migrate_sqlite_to_firebase():
    """
    One-shot utility: copies all rows from the local SQLite 'analyzed_articles'
    table into Firestore. Safe to call multiple times — it checks Firestore count
    first and skips if data already exists.

    Run manually after placing serviceAccountKey.json:
        python -c "import database; database.migrate_sqlite_to_firebase()"
    """
    if not USE_FIREBASE:
        logger.error("migrate_sqlite_to_firebase: Firebase is not enabled. Place serviceAccountKey.json first.")
        return

    existing = len(_db_cloud.collection("analyzed_articles").limit(1).get())
    if existing > 0:
        logger.info("migrate_sqlite_to_firebase: Firestore already has data — skipping migration.")
        return

    if not os.path.exists(DB_PATH):
        logger.info("migrate_sqlite_to_firebase: No local SQLite DB found — nothing to migrate.")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM analyzed_articles ORDER BY id ASC").fetchall()
    conn.close()

    if not rows:
        logger.info("migrate_sqlite_to_firebase: SQLite DB is empty — nothing to migrate.")
        return

    logger.info(f"migrate_sqlite_to_firebase: Migrating {len(rows)} articles to Firestore...")
    batch_size = 400  # Firestore batch limit is 500
    batch = _db_cloud.batch()
    count = 0
    for row in rows:
        d = dict(row)
        ts_raw = d.pop("timestamp", None)
        d.pop("id", None)  # Firestore auto-generates IDs
        try:
            d["timestamp"] = datetime.fromisoformat(ts_raw) if ts_raw else datetime.now(timezone.utc)
        except Exception:
            d["timestamp"] = datetime.now(timezone.utc)
        ref = _db_cloud.collection("analyzed_articles").document()
        batch.set(ref, d)
        count += 1
        if count % batch_size == 0:
            batch.commit()
            batch = _db_cloud.batch()
            logger.info(f"  ... committed {count}/{len(rows)}")
    if count % batch_size != 0:
        batch.commit()
    logger.info(f"✅ Migration complete — {count} articles pushed to Firestore.")


# ── Boot ──────────────────────────────────────────────────────────────────────
init_db()
