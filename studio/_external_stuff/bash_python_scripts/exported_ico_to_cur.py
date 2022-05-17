"""
Convert a file from .ICO to .CUR format.
See: https://en.wikipedia.org/wiki/ICO_(file_format)

Args:
  path (str): The path (+ name + extension) to the file being edited. Defaults to 'cursorOver.ico'.
  x: (int, base 10): Horizontal coordinates of the hotspot in number of pixels from the left. Base 10. Defaults to 0.
  y: (int, base 10): Vertical coordinates of the hotspot in number of pixels from the top. Base 10. Defaults to 0.

"""

def ico_to_cur(path = "cursorOver.ico", x = 0, y = 0):
	values = [[2],[x],[y]]
	offsets = [2, 10, 12]
	
	f = open(path, "r+b")
	for i in range(len(offsets)):
		f.seek(offsets[i])
		f.write(bytearray(values[i]))
	
	f.close()
	print(path + "==> Done!")