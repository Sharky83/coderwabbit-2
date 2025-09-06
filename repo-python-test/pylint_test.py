# This file is intentionally written to trigger pylint errors

def BADFunction():
    print('This function name is not snake_case')
    x = 1
    y = 2
    print(x +  y) # Extra space, bad style
    return None

class badClass:
    def __init__(self):
        self.value = 42
    def BADMethod(self):
        print('Bad method name')

# Unused variable
unused_var = 123

# Unused import
import sys

# Too many branches
if x == 1:
    pass
elif x == 2:
    pass
elif x == 3:
    pass
elif x == 4:
    pass
elif x == 5:
    pass
elif x == 6:
    pass
elif x == 7:
    pass
elif x == 8:
    pass
elif x == 9:
    pass
else:
    pass
