
export default function ExploreCarousel({title, children}){
  return (
    <div className="explore-section">
      <span className="title" > {title}</span>
      <div className="carousel"> {children} </div>
    </div>
  )
}