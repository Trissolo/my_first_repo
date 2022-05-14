#Gimp Python Script for room's JSON
import json

depth_categories = {

"bg": -10,  # BACKGROUND
"tz": 0,  # TRIGGERZONE
"co": 1,  # COVERED
"ab": 2,  # ALWAYSBACK
"ds": 3,  # DEEPSORTED
"fg": 4   # FOREGROUND
}


layer_name_separator = ","
separator = "_"

# output
main_container = {}
room_element_list = []


# helper functions

def is_visible(item):
	return pdb.gimp_item_get_visible(item)


def tuple_to_string(t):
  return separator.join(str(int(x)) for x in t)

  
# pass-in a layer and get a tuple containing its: x, y, width and height

def get_rectangle_coords(layer_param):
  x, y = layer_param.offsets
  w = layer_param.width
  h = layer_param.height
  return (x, y, w, h)


# builders:

def top_left_origin(current_layer, depth, frame_name, container):
  container['frame'] = frame_name
  container['depth'] = depth
  container['coords'] = tuple_to_string(current_layer.offsets)


def middle_down_origin(current_layer, depth, frame_name, container):
  container['frame'] = frame_name
  container['depth'] = depth
  x, y, w, h = get_rectangle_coords(current_layer)
  container['coords'] = tuple_to_string( (x + w / 2, y + h) )


def background_image(current_layer, depth, frame_name, container):
  global main_container
  main_container['background'] = frame_name
  main_container['id'] = 0
  main_container['name'] = img.name.split(".")[0]
  main_container['atlas'] = 0


def trigger_zone(current_layer, depth, frame_name, container):
  container['depth'] = depth
  container['name'] = frame_name
  container['rect'] = tuple_to_string( get_rectangle_coords(current_layer) )


#let's start
img = gimp.image_list()[0]

#define actions:
actions = {"bg": background_image, "tz": trigger_zone, "co": top_left_origin, "ab": top_left_origin, "ds": middle_down_origin, "fg": top_left_origin}

#iterate!
for layer in img.layers:
  if is_visible(layer):
    k, n = layer.name.split(layer_name_separator)
    new_item = {}
    actions[k](layer, k, n, new_item)
    if (k != 'bg'):
      room_element_list.append(new_item)


#sorted room_element_list
#sorted_by_depth = sorted(room_element_list, key = lambda i: depth_categories[i['depth']])

#get room name from file name
#complete = {img.name.split(".")[0]: sorted_by_depth}
main_container['things'] = room_element_list
#get result
result = json.dumps(main_container, sort_keys = True)

#print(result[1:-1])
print(result)
