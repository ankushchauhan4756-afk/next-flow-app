import TextNodeComponent from './TextNode';
import ImageNodeComponent from './ImageNode';
import VideoNodeComponent from './VideoNode';
import LLMNodeComponent from './LLMNode';
import CropImageNodeComponent from './CropImageNode';
import ExtractFrameNodeComponent from './ExtractFrameNode';

export const nodeTypes = {
  text: TextNodeComponent,
  image: ImageNodeComponent,
  video: VideoNodeComponent,
  llm: LLMNodeComponent,
  crop: CropImageNodeComponent,
  extractFrame: ExtractFrameNodeComponent,
};

export {
  TextNodeComponent,
  ImageNodeComponent,
  VideoNodeComponent,
  LLMNodeComponent,
  CropImageNodeComponent,
  ExtractFrameNodeComponent,
};
