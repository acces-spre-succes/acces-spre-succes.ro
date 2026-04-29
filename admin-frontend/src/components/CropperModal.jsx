import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";

/**
 * Modal that lets the admin pan + zoom + crop the selected image to a
 * 1:1 square before submitting. Output is a JPEG Blob, which we then
 * stash back into the parent form as a File so the existing FormData
 * upload code path stays unchanged.
 *
 * Props:
 *   file:     File | null   - the user's chosen image (modal opens iff non-null)
 *   onCancel: () => void
 *   onCropped: (file: File) => void
 *   aspect?:  number        - default 1 (square avatars)
 */
export default function CropperModal({ file, onCancel, onCropped, aspect = 1 }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!file) {
            setImageSrc(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setImageSrc(url);
        // Reset crop state for new file
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const onCropComplete = useCallback((_areaPercent, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setBusy(true);
        try {
            const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels, file?.name || "photo.jpg");
            onCropped(croppedFile);
        } catch (err) {
            console.error("Crop failed:", err);
            alert("Nu s-a putut procesa imaginea.");
        } finally {
            setBusy(false);
        }
    };

    if (!file) return null;

    return (
        <div className="cropper-overlay" role="dialog" aria-modal="true">
            <div className="cropper-modal">
                <div className="cropper-modal__header">
                    <h3>Decupează imaginea</h3>
                    <p className="cropper-modal__hint">
                        Trage pentru a centra, folosește slider-ul pentru a apropia.
                    </p>
                </div>

                <div className="cropper-stage">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            showGrid={true}
                        />
                    )}
                </div>

                <div className="cropper-controls">
                    <label htmlFor="cropper-zoom" className="cropper-zoom-label">Zoom</label>
                    <input
                        id="cropper-zoom"
                        type="range"
                        min={1}
                        max={4}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                    />
                </div>

                <div className="cropper-actions">
                    <button type="button" className="button-delete" onClick={onCancel} disabled={busy}>
                        Anulează
                    </button>
                    <button type="button" className="button-add" onClick={handleSave} disabled={busy || !croppedAreaPixels}>
                        {busy ? "Se procesează..." : "Salvează imaginea"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Render the requested crop region of the source image to an offscreen
 * canvas and return it as a JPEG File. Quality 0.9 keeps detail without
 * blowing up the upload size.
 */
async function getCroppedFile(imageSrc, pixelCrop, fallbackName) {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    const blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
    );

    if (!blob) throw new Error("Canvas toBlob returned null");

    const baseName = (fallbackName || "photo").replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}
