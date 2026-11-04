import { Maia3 } from 'maia3-js/web';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url';

const modelUrl = 'https://huggingface.co/cemoss17/maia3-onnx/resolve/2a8295492e802fdea829cc9d30d8ad42fc3c7f72/maia3_5m.onnx';
const maia = new Maia3({
  variant: '5m',
  url: modelUrl,
  numThreads: 1,
  wasmPaths: { wasm: new URL(wasmUrl, self.location.href).href },
  temperature: 1,
  topK: 0
});

self.onmessage = async ({ data }) => {
  try {
    await maia.load();
    const { bestMove } = await maia.predict(data);
    self.postMessage({ bestMove });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
