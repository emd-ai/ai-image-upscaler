import Replicate from 'replicate'

const replicate = new Replicate({
  auth: import.meta.env.VITE_BF_API_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt, num_outputs = 2, quality = 'standard' } = req.body

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    // Validate num_outputs
    const outputCount = Math.min(Math.max(1, Number(num_outputs)), 2);

    const output = await replicate.run(
      "black-forest-labs/flux-dev",
      {
        input: {
          prompt: prompt,
          num_outputs: outputCount,
          quality: quality === 'high' ? 'high' : 'standard'
        }
      }
    )

    res.status(200).json({ images: output })
  } catch (error) {
    console.error('Error generating images:', error)
    res.status(500).json({ message: 'Error generating images' })
  }
}
