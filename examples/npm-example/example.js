import { QuranFileFormat } from '@quran-file-format/decoder';

const response = await fetch('uthmani.qur');
const buffer = await response.arrayBuffer();

const qur = new QuranFileFormat(buffer);
const suraAlFatiha = qur.sura(1);

if (suraAlFatiha.status === 'success') {
  const {value} = suraAlFatiha;
  console.log(value);
  document.body.innerText = value.toString();
}
