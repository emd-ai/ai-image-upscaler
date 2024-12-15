import Replicate from 'replicate';

const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
});

export const upscaleImage = async (imageUrl: string): Promise<string> => {
  try {
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: true
        }
      }
    );

    if (!output || typeof output !== 'string') {
      throw new Error('Invalid response from upscaler');
    }

    return output;
  } catch (error) {
    console.error('Error in upscaleImage:', error);
    throw new Error('Failed to upscale image');
  }
};
