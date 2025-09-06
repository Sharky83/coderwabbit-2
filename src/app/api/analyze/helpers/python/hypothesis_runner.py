import hypothesis
from hypothesis import given
import hypothesis.strategies as st

def run_hypothesis_tests():
    results = []
    # Example property-based test: square of any integer is non-negative
    @given(st.integers())
    def test_square_non_negative(x):
        assert x * x >= 0
    try:
        test_square_non_negative()
        results.append({
            'test': 'test_square_non_negative',
            'status': 'success',
            'output': 'All property-based tests passed.'
        })
    except AssertionError as e:
        results.append({
            'test': 'test_square_non_negative',
            'status': 'fail',
            'output': str(e)
        })
    except Exception as e:
        results.append({
            'test': 'test_square_non_negative',
            'status': 'error',
            'output': str(e)
        })
    return results

import json

if __name__ == "__main__":
    print(json.dumps(run_hypothesis_tests()))
