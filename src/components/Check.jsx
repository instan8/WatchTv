function MyComponent() {
  return (
    <div>
      {/* Single line clamp (truncate) */}
      <p className="truncate">This text will be truncated with an ellipsis if it's too long</p>
      
      {/* Multi-line clamp (3 lines in this example) */}
      <p className="line-clamp-3">This text will be clamped after three lines. Any additional text will be hidden and replaced with an ellipsis. This is useful for preview text or excerpts where you want to maintain consistent sizing.</p>
    </div>
  )
}

export default MyComponent