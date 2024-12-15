import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How does AI image upscaling work?",
      answer: "AI image upscaling uses machine learning algorithms to analyze and enhance low-resolution images, adding realistic details to create high-quality, larger versions of the original image."
    },
    {
      question: "What image formats are supported?",
      answer: "Our AI upscaler supports common image formats including JPG, PNG, and WebP. We're constantly working to expand our format support."
    },
    {
      question: "Is there a limit to how many images I can upscale?",
      answer: "Free users can upscale up to 5 images per day. Premium users enjoy unlimited upscaling."
    },
    {
      question: "How secure is my data when using your service?",
      answer: "We take data security seriously. All uploaded images are processed securely and are never stored on our servers after processing is complete."
    },
    {
      question: "Can I use the upscaled images commercially?",
      answer: "Yes, you retain all rights to your upscaled images. However, please ensure you have the necessary rights to the original image before using it commercially."
    }
  ];

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="section-heading">Frequently Asked Questions About AI Image Upscalers</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Disclosure as="div" key={index} className="bg-gray-800 rounded-lg">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-left text-white focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-2 pb-4 text-gray-300">
                    {faq.answer}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  )
}

export default FAQ