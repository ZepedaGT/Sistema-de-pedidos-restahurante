import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Limpiar: primero las tablas hijas, luego las padres
  await prisma.pedido_producto.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.foto_producto.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.direccion.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Usuarios
  const passwordHash = await bcrypt.hash("123456", 10);

   const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador",
      correo: "admin@restaurante.com",
      password: passwordHash,
      telefono: "50255550000",
      rol: "ADMIN",
    },
  });

  const cliente = await prisma.usuario.create({
    data: {
      nombre: "Juan Pérez",
      correo: "juan@correo.com",
      password: passwordHash,
      telefono: "50244440000",
    },
  });

  // 3. Direcciones
  const direccionJuan = await prisma.direccion.create({
    data: {
      lugar: "6a avenida 5-20, zona 1, Ciudad de Guatemala",
      id_usuario: cliente.id_usuario,
    },
  });

  // 4. Categorías
  const bebidas = await prisma.categoria.create({ data: { nombre: "Bebidas" } });
  const platos = await prisma.categoria.create({ data: { nombre: "Platos fuertes" } });
  const postres = await prisma.categoria.create({ data: { nombre: "Postres" } });

  // 5. Productos
  const cola = await prisma.producto.create({
    data: {
      nombre: "Coca Cola",
      precio: 10,
      descripcion: "Botella de 355 ml",
      id_categoria: bebidas.id_categoria,
    },
  });

  const limonada = await prisma.producto.create({
    data: {
      nombre: "Limonada natural",
      precio: 12,
      descripcion: "Con hielo y azúcar",
      id_categoria: bebidas.id_categoria,
    },
  });

  const pollo = await prisma.producto.create({
    data: {
      nombre: "Pollo asado",
      precio: 55,
      descripcion: "Con arroz y ensalada",
      id_categoria: platos.id_categoria,
    },
  });

  const hamburguesa = await prisma.producto.create({
    data: {
      nombre: "Hamburguesa",
      precio: 45,
      descripcion: "Con papas fritas",
      id_categoria: platos.id_categoria,
    },
  });

  await prisma.producto.create({
    data: {
      nombre: "Flan",
      precio: 20,
      id_categoria: postres.id_categoria,
    },
  });

  // 6. Fotos (URLs de ejemplo, cámbialas por las tuyas)
  await prisma.foto_producto.createMany({
    data: [
      { url: "https://placehold.co/600x400?text=Pollo", id_producto: pollo.id_producto },
      { url: "https://placehold.co/600x400?text=Hamburguesa", id_producto: hamburguesa.id_producto },
    ],
  });

  // 7. Un pedido de ejemplo con sus detalles
  const total = 55 * 1 + 10 * 2; // pollo x1 + cola x2

    // 7a. Pedido de INVITADO (sin cuenta)
  await prisma.pedido.create({
    data: {
      nombre_cliente: "María López",
      telefono_cliente: "50233330000",
      tipo_entrega: "DOMICILIO",
      direccion_entrega: "12 calle 3-45, zona 10, Ciudad de Guatemala",
      total: 45,
      pedido_producto: {
        create: [
          { id_producto: hamburguesa.id_producto, cantidad: 1, precio_unitario: 45 },
        ],
      },
    },
  });

  // 7b. Pedido de usuario REGISTRADO
  await prisma.pedido.create({
    data: {
      id_usuario: cliente.id_usuario,
      id_direccion: direccionJuan.id_direccion,
      nombre_cliente: cliente.nombre,
      telefono_cliente: cliente.telefono ?? "",
      correo_cliente: cliente.correo,
      tipo_entrega: "DOMICILIO",
      direccion_entrega: direccionJuan.lugar,
      total: 75,
      pedido_producto: {
        create: [
          { id_producto: pollo.id_producto, cantidad: 1, precio_unitario: 55, nota: "Sin cebolla" },
          { id_producto: cola.id_producto, cantidad: 2, precio_unitario: 10 },
        ],
      },
    },
  });

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());