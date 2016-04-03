from distutils.core import setup
from Cython.Build import cythonize

setup(
  name = 'astrogears',
  ext_modules = cythonize("astrogears.py"),
)

