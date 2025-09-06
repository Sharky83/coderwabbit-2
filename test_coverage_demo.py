def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# Tests for coverage demonstration

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 0) == 0

def test_multiply():
    assert multiply(2, 3) == 6
    assert multiply(-1, 1) == -1

def test_divide():
    assert divide(6, 3) == 2
    assert divide(5, 2) == 2.5
    try:
        divide(1, 0)
    except ValueError:
        pass
    else:
        assert False, "Expected ValueError for divide by zero"

if __name__ == "__main__":
    import pytest
    pytest.main([__file__])
