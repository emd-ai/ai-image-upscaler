import Replicate from 'replicate'

const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' })
    }

    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: false
        }
      }
    )

    res.status(200).json({ upscaledImage: output })
  } catch (error) {
    console.error('Error upscaling image:', error)
    res.status(500).json({ message: 'Error upscaling image' })
  }
}