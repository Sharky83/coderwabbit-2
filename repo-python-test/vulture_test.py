# This file is intentionally written to trigger vulture (unused code) warnings

def used_function():
    print("This function is used.")

used_function()

def unused_function():
    print("This function is never called.")

class UsedClass:
    def method(self):
        pass

obj = UsedClass()
obj.method()

class UnusedClass:
    def unused_method(self):
        pass

unused_var = 42

# The following function and class are not used anywhere

def another_unused():
    return 123

class AnotherUnused:
    pass
