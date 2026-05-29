import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

const IMAGES_DIR = "./images";
const EXPECTED_IMAGES = [
  "labanda.png",
  "finca.png",
  "church.png",
  "iglesia-torrelaguna.png",
  "location.png",
  "entrada_finca.jpeg",
  "mesas_finca.jpg",
  "wedding-venue.jpg",
];

test("carpeta images existe", () => {
  assert.ok(existsSync(IMAGES_DIR), "La carpeta images debe existir");
});

test("todas las imágenes esperadas existen", () => {
  const files = readdirSync(IMAGES_DIR);
  EXPECTED_IMAGES.forEach((img) => {
    assert.ok(
      files.includes(img),
      `La imagen ${img} debe existir en la carpeta images/`
    );
  });
});

test("archivo labanda.png existe y tiene tamaño > 0", () => {
  const filePath = join(IMAGES_DIR, "labanda.png");
  assert.ok(existsSync(filePath), "labanda.png debe existir");
  const stats = statSync(filePath);
  assert.ok(stats.size > 0, "labanda.png debe tener contenido");
});

test("las imágenes .png son válidas (tamaño > 100 bytes)", () => {
  const pngImages = EXPECTED_IMAGES.filter((img) => img.endsWith(".png"));
  pngImages.forEach((img) => {
    const filePath = join(IMAGES_DIR, img);
    const stats = statSync(filePath);
    assert.ok(
      stats.size > 100,
      `${img} debe tener un tamaño válido (> 100 bytes), tiene ${stats.size} bytes`
    );
  });
});
