/**
 * storageService - Serviço para upload de documentos no Firebase Storage
 * 
 * Funções:
 * - Upload de arquivo
 * - Deletar arquivo
 * - Obter URL pública
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { storage } from './firebaseConfig';

export interface UploadProgress {
  progress: number; // 0-100
  bytesTransferred: number;
  totalBytes: number;
}

/**
 * Upload de arquivo com progresso
 */
export async function uploadFile(
  file: {
    name: string;
    size: number;
    uri: string;
    type: string;
  },
  vendorId: string,
  documentType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    // Criar referência do arquivo
    const fileName = `${vendorId}/${documentType}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `compliance/${fileName}`);

    // Converter URI para Blob
    const response = await fetch(file.uri);
    const blob = await response.blob();

    // Upload com monitoramento de progresso
    const uploadTask = uploadBytesResumable(fileRef, blob, {
      contentType: file.type,
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
          });
        },
        (error) => {
          console.error('Erro no upload:', error);
          reject(new Error('Falha ao fazer upload do arquivo'));
        },
        async () => {
          // Upload concluído, obter URL
          try {
            const downloadURL = await getDownloadURL(fileRef);
            resolve(downloadURL);
          } catch (err) {
            reject(new Error('Falha ao obter URL do arquivo'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
}

/**
 * Deletar arquivo
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extrair caminho do arquivo da URL
    const decodedUrl = decodeURIComponent(fileUrl);
    const pathStart = decodedUrl.indexOf('/compliance/') + 1;
    const pathEnd = decodedUrl.indexOf('?');
    const filePath = decodedUrl.substring(pathStart, pathEnd > -1 ? pathEnd : undefined);

    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw new Error('Falha ao deletar arquivo');
  }
}

export default {
  uploadFile,
  deleteFile,
};
