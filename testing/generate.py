import random

def random_ints(n: int = 100):
    return [str(random.randint(0, 1000)) for _ in range(n)]

def random_floats(n: int = 999):
    return [str(random.randint(-10000, 10000) / 100) for _ in range(n)]
print(','.join(random_floats()))
