export interface Files {
  id_file: number;
  id_user: number;
  name: string;
  audioStream: AudioBufferSourceNode;
  file: File;
  path: string;
  created: Date;
}
