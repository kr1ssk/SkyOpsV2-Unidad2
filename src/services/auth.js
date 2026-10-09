import { keys, read, write } from "./storage";

// Simulación académica inspirada en 02-usuario del docente. No es autenticación de producción.
export function signIn(email, password) {
  const user = read(keys.users).find(
    (item) =>
      item.email === email.trim().toLowerCase() && item.password === password,
  );
  if (!user) throw new Error("Correo o contraseña incorrectos.");
  const { password: ignored, ...session } = user;
  write(keys.session, session);
  return session;
}
export function signUp(form) {
  if (form.nombre.trim().length < 5 || !form.nombre.trim().includes(" "))
    throw new Error("Escribe nombre y apellido.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    throw new Error("Ingresa un correo válido.");
  if (form.password.length < 6)
    throw new Error("Usa una contraseña de al menos 6 caracteres.");
  if (!form.direccion.trim())
    throw new Error("Ingresa una dirección de entrega.");
  const users = read(keys.users),
    email = form.email.trim().toLowerCase();
  if (users.some((user) => user.email === email))
    throw new Error("El correo ya está registrado.");
  const user = {
    ...form,
    email,
    nombre: form.nombre.trim(),
    id: crypto.randomUUID(),
    rol: "usuario",
  };
  write(keys.users, [...users, user]);
  return signIn(email, form.password);
}
export function signOut() {
  write(keys.session, null);
}
export function updateUser(id, changes) {
  const users = read(keys.users);
  const user = users.find((item) => item.id === id);
  if (!user) throw new Error("Usuario no encontrado.");
  if (!changes.nombre?.trim() || !changes.direccion?.trim())
    throw new Error("Completa nombre y dirección.");
  const updated = {
    ...user,
    nombre: changes.nombre.trim(),
    direccion: changes.direccion.trim(),
  };
  write(
    keys.users,
    users.map((item) => (item.id === id ? updated : item)),
  );
  if (read(keys.session, null)?.id === id) {
    const { password: ignored, ...session } = updated;
    write(keys.session, session);
  }
}
