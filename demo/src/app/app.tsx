import { useEffect, useMemo, useState } from 'react';
import { useAssets } from './hooks/useAssets';
import { QuranSvgRenderer, SvgRenderResult } from "@hudabook/qvf_svg_renderer";

export function App() {
  const assets = useAssets();
  const [ayah, setAyah] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [render, setRenderResult] = useState<SvgRenderResult[]>([]);
  const [words, setWords] = useState<string[]>([]);
  useEffect(() => {
    if (assets.qur) {
      let sura = assets.qur.sura(1);
      if (sura.status === 'success') {
        let fatiha = sura.value;
        const [first_ayah] = fatiha.ayahs;
        setAyah(first_ayah.join(' '));
        let svg = new QuranSvgRenderer();
        let ayah_words = first_ayah.map(word => word.toString());
        setWords(ayah_words)
        assets.load_words(ayah_words).then(
          data => {
            let render_result = svg.render(data, fontSize);
            setRenderResult(render_result);
            console.log(render_result)
          }
        )
      }
    }
  }, [assets.qur])

  const qvf_bytes: string[] = useMemo(() => {
    const [word] = words;
    if (!word) return [];
    const wb = assets.qvf.current.get(word);
    if (!wb) return [];
    const bytes = new Uint8Array(wb);
    return [...bytes].map(b => b.toString(16).padStart(2, '0').toUpperCase());
  });

  return (
    <section>
      <section className='bg-black text-zinc-50 pt-10'>
        <div className='flex flex-col gap-y-9'>
          <p className='text-center text-sky-100' style={{ fontSize: fontSize + 'pt' }}>{ayah}</p>
          <div className='flex items-center justify-center gap-x-9' >
            {
              render.map((result, i) => {
                return (
                  <div>
                    <small dir='ltr' className='text-xs block text-gray-100/40 text-left px-2 py-1'>
                      {words[i]}.qvf
                    </small>
                    <div className='bg-orange-100/10 rounded-md p-5 h-32 flex flex-col items-center justify-center' >
                      <svg className='fill-orange-300' width={result.width} height={result.height} viewBox={result.viewbox}>
                        {
                          result.paths.map(path => {
                            return <path d={path.d} />
                          })
                        }
                      </svg>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>
      <div className='h-20 bg-black'></div>
      <div className='h-60 bg-gradient-to-b from-black to-white'>

        <section dir='ltr' className='rounded-lg bg-black text-white w-8/12 mx-auto '>
          <pre className='pt-2 text-xs border border-white/10 rounded-lg text-center'>Hex View - [0].qvf</pre>
          <div className='grid grid-cols-12 gap-1 p-4'>
            {
              qvf_bytes.slice(0, 228).map(b => (
                <pre className='bg-gray-900/60 rounded-md text-gray-200/70 text-sm flex justify-center align-center pt-1'>
                  {b}
                </pre>
              ))
            }
          </div>
        </section>

      </div>
    </section>
  );
}

export default App;
