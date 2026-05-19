import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import "./style.css";
import { useInitWasm } from "./useInitWasm";
import { greet } from "src-rust";

const CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    width: 800,
    height: 600,
    facingMode: "user",
  },
};

export function App() {
  const [err, setErr] = useState<DOMException | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isLoading, error: wasmErr } = useInitWasm();

  const getImgData = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (ctx) {
        const width = 150;

        canvas.width = width;
        canvas.height = width * (video.height / video.width);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(data.data);

        if (!isLoading && !wasmErr) {
          greet("Николай");
        }
      }

      requestAnimationFrame(getImgData);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(CONSTRAINTS)
      .then((s) => setStream(s))
      .catch((err) => setErr(err));
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  if (!stream)
    return (
      <div className="errContainer">
        <h2>Please turn on your web camera</h2>
      </div>
    );

  if (err || wasmErr)
    return (
      <div className="errContainer">
        <h2>{err?.name || wasmErr?.name}</h2>
        <p>{err?.message || wasmErr?.message}</p>
      </div>
    );

  return (
    <div>
      <video
        ref={videoRef}
        onPlay={getImgData}
        height={600}
        width={800}
        autoPlay
        playsInline
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "auto",
          imageRendering: "pixelated",
        }}
      ></canvas>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
