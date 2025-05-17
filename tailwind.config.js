// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // NOTE: Update this to include the paths to all of your component files.
//   content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {

        'heading-1': ['24px', { lineHeight: '32px', fontWeight: '900'}],
        'heading-2': ['20px', { lineHeight: '28px', fontWeight: '600' }],   // 1.4 ratio
        'heading-3': ['16px', { lineHeight: '24px', fontWeight: '600' }],    // 1.5 ratio
        'heading-4': ['14px', { lineHeight: '20px', fontWeight: '600' }],   // ~1.43 ratio        'subheading-1': ['12px', { lineHeight: '18px', fontWeight: '500' }], // 1.5 ratio
        'heading-5': ['12px', { lineHeight: '18px', fontWeight: '600' }],   // ~1.43 ratio        'subheading-1': ['12px', { lineHeight: '18px', fontWeight: '500' }], // 1.5 ratio
        'subheading': ['12px', { lineHeight: '18px', fontWeight: '600' }],   // ~1.43 ratio        'subheading-1': ['12px', { lineHeight: '18px', fontWeight: '500' }], // 1.5 ratio
      },
      
      colors: {
        primary: '#3c8b27',
        secondary: '#000000',
        cars: '#106099',
        garage: '#EF4444',
        spareparts: '#FFA828',
        otherservice: '#79B3B9',
        'heading-default': '#1F2937',
        'subheading-default': '#6B7280',
      },
    },
  },
  plugins: [],
}