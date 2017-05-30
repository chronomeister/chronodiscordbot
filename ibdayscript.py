import re
group = ""
flair = ""
lines = []
parser = re.compile('(\d{2}) (\d{2}) - ([^\r\n]+)')
with open("./idolbday.json", "w") as ojson, open("./idolbday.txt", "r") as ibday:
    print("[", file=ojson)
    for line in ibday:
        line = line.rstrip()
        if (not line): # eat up next line for group name
            group = ibday.readline().rstrip()
            line = ibday.readline().rstrip()
            flair = ""
        matches = parser.match(line)
        if (not matches):
            flair = line
            # print(flair)
        else:
            lines.append('  { "name" : "%s", "month" : "%s", "day" : "%s", "flair" : "%s", "series" : "%s" }' % (matches.group(3), matches.group(1), matches.group(2), flair, group))
            # print(matches.group(3))
    print(",\n".join(lines), file=ojson)
    print("]", file=ojson)
