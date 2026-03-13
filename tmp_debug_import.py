import pathlib
p = pathlib.Path(r'G:/Truthlens/frontend/public/src/components/EventComparison.jsx')
lines = p.read_text(encoding='utf-8').splitlines()
print('line1 repr:', repr(lines[0]))
print('line2 repr:', repr(lines[1]))
