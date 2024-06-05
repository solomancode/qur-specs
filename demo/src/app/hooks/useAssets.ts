import { useEffect, useRef, useState } from 'react';
import { QuranFileFormat } from '@hudabook/qur';
import qur_url from '../../assets/uthmani.qur?url';

export const useAssets = () => {
  const [qur, setQur] = useState<QuranFileFormat>();
  const qvf = useRef<Map<string, ArrayBuffer>>(new Map());

  const load_qur = async () => {
    const r = await fetch(qur_url);
    return await r.arrayBuffer();
  };

  useEffect(() => {
    (async () => {
      const buf = await load_qur();
      setQur(new QuranFileFormat(buf));
    })();
  }, []);

  const load_word_qvf = async (word: string) => {
    if (qvf.current.has(word)) return qvf.current.get(word)!;
    const r = await fetch(`/src/assets/qvf/${word}.qvf`);
    const buf = await r.arrayBuffer();
    qvf.current.set(word, buf);
    return buf;
  };

  const load_words = async (words: string[]) => {
    return Promise.all(words.map(load_word_qvf));
  };

  return { qur, qvf, load_qur, load_word_qvf, load_words };
};
