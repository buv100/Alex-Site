from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove

orig_path = Path("public/images/alex-garibian-original.jpg")
out_path = Path("public/images/alex-garibian.jpg")

orig = Image.open(orig_path).convert("RGB")
print("orig", orig.size)

session = new_session("u2net_human_seg")
cut = remove(orig, session=session)
arr = np.array(cut)
alpha = arr[:, :, 3]
ys, xs = np.where(alpha > 20)
x0, x1 = int(xs.min()), int(xs.max())
y0, y1 = int(ys.min()), int(ys.max())
print("subject bbox", x0, y0, x1, y1, "size", x1 - x0, y1 - y0, "ratio", (x1 - x0) / (y1 - y0))

bw, bh = x1 - x0, y1 - y0
pad_x = int(bw * 0.08)
pad_y = int(bh * 0.06)
x0 = max(0, x0 - pad_x)
y0 = max(0, y0 - pad_y)
x1 = min(arr.shape[1] - 1, x1 + pad_x)
y1 = min(arr.shape[0] - 1, y1 + pad_y)

subject = cut.crop((x0, y0, x1 + 1, y1 + 1))
sw, sh = subject.size
print("padded subject", sw, sh, "ratio", sw / sh)

target_ratio = 3 / 4
out_h = 1600
out_w = int(out_h * target_ratio)

scale = min(out_w / sw, out_h / sh) * 0.92
nw, nh = int(sw * scale), int(sh * scale)
subject_r = subject.resize((nw, nh), Image.Resampling.LANCZOS)

bg = Image.new("RGBA", (out_w, out_h), (19, 18, 16, 255))
ox = (out_w - nw) // 2
oy = max(0, int((out_h - nh) * 0.18))
bg.paste(subject_r, (ox, oy), subject_r)

web = bg.convert("RGB").resize((900, 1200), Image.Resampling.LANCZOS)
web.save(out_path, "JPEG", quality=90, optimize=True)
print("saved", out_path, web.size, "bytes", out_path.stat().st_size)

arr2 = np.array(web)
mask = arr2.mean(axis=2) > 35
ys2, xs2 = np.where(mask)
print(
    "final subject frac",
    (xs2.max() - xs2.min()) / web.size[0],
    (ys2.max() - ys2.min()) / web.size[1],
    "subj_ratio",
    (xs2.max() - xs2.min()) / (ys2.max() - ys2.min()),
)
