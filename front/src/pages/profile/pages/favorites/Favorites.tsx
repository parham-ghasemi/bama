const Favorites = () => {
  return (
    <div className="w-full">
      <h2 className="font-semibold text-lg">مورد علاقه‌ها</h2>
      <div className="flex flex-col items-center justify-center mt-8">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/007/104/553/small/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
          alt="تصویر لیست خالی مورد علاقه‌ها"
          className="w-64 h-auto mb-4"
        />
        <p className="text-gray-500 text-center">لیست علاقه‌مندی‌های شما خالی است. چند مورد اضافه کنید تا اینجا ببینید!</p>
      </div>
    </div>
  )
}

export default Favorites