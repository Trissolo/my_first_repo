# Get XY coordinates of each point in first path of any vector inside an .xcf image
# Make sure that the path with the polygon representing the walkable area is the first in the list (at the top of the paths tab).

# We want json!
import json

# Latest opened image
img = gimp.image_list()[0]

# The list that will contain all list of coordinates
coords = []

# The dictionary that will become our json
main_container = {"coords": coords}


# func get floor (Polygon Map)
def get_fl(immy):
  global coords
  
  for idx, vector in enumerate(immy.vectors):
    if idx == 0:
      main_container['nome'] = vector.name
             
    x_and_y_values = []
    coords_list = vector.strokes[0].points[0]
    
    for i in range(0, len(coords_list), 6):
      x_and_y_values.append( int(coords_list[i]) )
      x_and_y_values.append( int(coords_list[i + 1]) )
      
    coords.append(x_and_y_values)

# Grab all!
get_fl(img)

# Done!
result = json.dumps(main_container, sort_keys = True)
print(result)



#In memoriam
#starting_stroke_id = pdb.gimp_vectors_get_strokes(poly)[1]
#coordinate = pdb.gimp_vectors_stroke_get_points(poly, starting_stroke_id[0])[2]
#    for i in range(0, len(coordinate), 6):
#      vals.append(int(coordinate[i]))
#      vals.append(int(coordinate[i + 1]))
