import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Your 4-Square Grid Logo */}
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '24px', height: '24px' }}>
            <div style={{ width: '10px', height: '10px', background: '#0f172a', margin: '1px' }}></div>
            <div style={{ width: '10px', height: '10px', background: '#f97316', margin: '1px' }}></div>
            <div style={{ width: '10px', height: '10px', background: '#94a3b8', margin: '1px' }}></div>
            <div style={{ width: '10px', height: '10px', background: '#fce7f3', margin: '1px' }}></div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}