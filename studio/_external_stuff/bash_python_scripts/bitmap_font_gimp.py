img = gimp.image_list()[0]
chars_count = 0
char_info = ""
lineHeight = 0
special = {"Á": 193,"È": 200,"Ì": 204,"Ò": 210,"Ù": 217,"à": 224,"è": 232,"ì": 236,"ò": 242,"ù": 249,"&": 38,"<": 60,">": 62,'"': 34,"'": 39,"space": 32," ": 32}

def get_char_code(string_param, i):
  global chars_count
  if special.has_key(string_param):
    chars_count += 1
    return special[string_param]
  elif len(string_param.encode("utf-8")) == 1:
    chars_count += 1
    return ord(string_param)
  else: return "*****" + string_param + " " + str(i) + "*****"


def make_line(c, x, y, w, h):
  return '<char id="{c}" x="{x}" y="{y}" width="{w}" height="{h}" xoffset="0" yoffset="0" xadvance="{w}"/>\n'.format(c=c, x=x, y=y, w=w, h=h)

for idx, layer in enumerate(img.layers):
  if layer.visible == True:
    c = get_char_code(layer.name, idx)
    x, y = layer.offsets
    w = layer.width
    h = layer.height
    lineHeight = h
    char_info += make_line(c, x, y, w, h)


res = '<?xml version="1.0"?>\n<font>\n  <info face="Place_a_name" size="4"/>\n  <common lineHeight="{lh}"/>\n  <chars count="{cc}">\n'.format(lh = lineHeight, cc = chars_count)
res += char_info
res +='  </chars>\n</font>'
print(res)