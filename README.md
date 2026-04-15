# Kestrel Studios Website

Built with [Astro](https://astro.build) and Tailwind CSS.

## Development

```bash
npm install
npm run dev -- --host
```

Site runs at `http://localhost:4321`. The `--host` flag exposes it on the local network.

**Note:** Astro's file watcher does not always detect changes to `.astro` or `.ts` files. Restart the dev server after edits to see changes.

---

## Adding Images to a Service Page

Each service in `src/data/services.ts` supports optional image fields:

```ts
heroImage: '/filename.jpg',    // Hero section (top of page)
sectionImage: '/filename.jpg', // "Who It's For" section
```

1. Copy the image into `public/`
2. Add the field(s) to the relevant service entry in `src/data/services.ts`
3. Restart the dev server

If no image is set, the page falls back to `property_image1.png` / `property_image2.png`.

For large source files (e.g. TIF from WebODM), convert and resize first:

```bash
convert input.tif -resize 1400x -quality 85 public/output.webp
```

---

## Adding a 3D Model to a Service Page

Each service supports an optional `modelSrc` field. When set, an interactive 3D model viewer appears on the service page between the "Who It's For" and "Deliverables" sections.

### Step 1 — Export from WebODM

In WebODM, open the task and download the 3D model asset. WebODM/Propeller exports a `.glb` file with embedded textures.

### Step 2 — Compress the model

WebODM GLB files are typically 40–100MB with very high-resolution textures. Run the script below to resize textures and repack to a web-friendly size (~2MB):

```bash
python3 << 'EOF'
from pygltflib import GLTF2
from PIL import Image
import io, os
Image.MAX_IMAGE_PIXELS = None  # allow large textures

src = '/path/to/your-model.glb'          # source from WebODM
dst = 'public/your-model-name.glb'       # destination in public/

MAX_DIM = 512   # max texture dimension in pixels
QUALITY = 70    # JPEG quality (0-100)

g = GLTF2().load(src)
blob = g.binary_blob()

def get_image_bytes(g, blob, idx):
    img = g.images[idx]
    bv = g.bufferViews[img.bufferView]
    start = bv.byteOffset or 0
    return blob[start:start + bv.byteLength]

new_image_data = []
for i in range(len(g.images)):
    raw = get_image_bytes(g, blob, i)
    pil = Image.open(io.BytesIO(raw))
    pil.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    buf = io.BytesIO()
    pil.save(buf, format='JPEG', quality=QUALITY, optimize=True)
    new_image_data.append(buf.getvalue())
    print(f"  Image {i}: {len(raw)//1024}KB -> {len(new_image_data[-1])//1024}KB")

image_bv_indices = set(g.images[i].bufferView for i in range(len(g.images)))
geom_bvs = [bv for j, bv in enumerate(g.bufferViews) if j not in image_bv_indices]
geom_end = max((bv.byteOffset or 0) + bv.byteLength for bv in geom_bvs) if geom_bvs else 0
geom_end = (geom_end + 3) & ~3

new_blob = bytearray(blob[:geom_end])
new_offsets = []
for data in new_image_data:
    while len(new_blob) % 4:
        new_blob.append(0)
    new_offsets.append(len(new_blob))
    new_blob.extend(data)

for i, img in enumerate(g.images):
    bv = g.bufferViews[img.bufferView]
    bv.byteOffset = new_offsets[i]
    bv.byteLength = len(new_image_data[i])

g.buffers[0].byteLength = len(new_blob)
g.set_binary_blob(bytes(new_blob))
g.save(dst)

print(f"\nDone: {os.path.getsize(src)/1024/1024:.1f} MB -> {os.path.getsize(dst)/1024/1024:.1f} MB")
EOF
```

**Dependencies** (install once):
```bash
pip3 install pygltflib Pillow --break-system-packages
```

### Step 3 — Wire it up

Add the `modelSrc` field to the relevant service in `src/data/services.ts`:

```ts
{
  title: '3D Site Models and Measurements',
  slug: '3d-site-models-measurements',
  modelSrc: '/your-model-name.glb',
  // ...
}
```

### Step 4 — Restart the dev server

The viewer supports drag to orbit, scroll to zoom, and right-click to pan. It uses Google's [`<model-viewer>`](https://modelviewer.dev) web component, loaded via the BaseLayout.
