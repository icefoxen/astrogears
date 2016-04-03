from distutils.core import setup
from Cython.Build import cythonize

setup(
  name = 'astrogears',
  ext_modules = cythonize("astrogears.pyx"),
)

# Compile using cython with:
# python3 setup.py build_ext --inplace
