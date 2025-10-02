# Griffith's Introduction to EM: Problem 3.17

import numpy as np
import matplotlib.pyplot as plt

V = 60
a = 1
b = 2
iter = 55

x = np.arange(0, b, 0.05)
y = np.arange(0, a, 0.05)
x, y = np.meshgrid(x, y)

z = 0

for i in range(0, iter):
    z += np.sinh((2*i+1)*np.pi*x/a)/((2*i+1)*np.sinh((2*i+1)*np.pi*b/a))*np.sin((2*i+1)*np.pi*y)

z *= 4 * V / np.pi

fig = plt.figure(figsize=(10,5))
ax1 = fig.add_subplot(1, 2, 1)
ax2 = fig.add_subplot(1, 2, 2, projection='3d')

ax1.contourf(x, y, z)
ax2.set_title('Contour plot')

ax2.plot_surface(x, y, z,cmap='viridis')
ax2.set_title('Surface plot')

plt.show()
