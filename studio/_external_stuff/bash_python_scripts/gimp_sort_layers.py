'''
img = gimp.image_list()[0]

def get_layer_name(elem):
    return elem.name


first_sort = sorted(img.layers, key = get_layer_name)

depthCategories = {'ab': 3, 'co': 2, 'rf': 0, 'bg': -10, 'fg': 800, 'ds': 4, 'ta': 1}

def get_depth(layer):
    name = layer.name
    return depthCategories[name[0:2]]

second_sort = sorted(first_sort, key = get_depth)

for layer in second_sort:
    layer = pdb.gimp_image_get_layer_by_name(img, layer.name)
    #pdb.gimp_image_lower_item_to_bottom(img, layer)
    pdb.gimp_image_raise_item_to_top(img, layer)
'''
