# mypy_test.py

def add(a: int, b: int) -> int:
    return a + b

# Intentional type error for mypy to catch
def test_type_error():
    result = add("1", 2)  # Should be flagged by mypy
    print(result)

if __name__ == "__main__":
    test_type_error()
