from hypothesis import given, strategies as st
import math

# Test: Square of any integer is non-negative
@given(st.integers())
def test_square_non_negative(x):
    assert x * x >= 0

# Test: Addition is commutative
@given(st.integers(), st.integers())
def test_addition_commutative(a, b):
    assert a + b == b + a

# Test: Multiplication is commutative
@given(st.integers(), st.integers())
def test_multiplication_commutative(a, b):
    assert a * b == b * a

# Test: Division by non-zero returns a float
@given(st.integers(), st.integers().filter(lambda y: y != 0))
def test_division_type(x, y):
    result = x / y
    assert isinstance(result, float)

# Test: String concatenation length
@given(st.text(), st.text())
def test_string_concat_length(a, b):
    assert len(a + b) == len(a) + len(b)

# Test: List reversal
@given(st.lists(st.integers()))
def test_list_reverse(lst):
    assert lst == list(reversed(list(reversed(lst))))

# Test: Sorting a list returns a sorted list
@given(st.lists(st.integers()))
def test_list_sort(lst):
    sorted_lst = sorted(lst)
    assert all(sorted_lst[i] <= sorted_lst[i+1] for i in range(len(sorted_lst)-1))

# Test: Square root of a non-negative number is non-negative
@given(st.integers(min_value=0, max_value=10000))
def test_sqrt_non_negative(x):
    assert math.sqrt(x) >= 0

if __name__ == "__main__":
    import pytest
    pytest.main([__file__])
