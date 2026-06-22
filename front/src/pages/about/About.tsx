import Footer from "../../components/Footer"
import Header from "../../components/Header"
import SignupBtn from "../../components/SignupBtn"

const About = () => {
  return (
    <div className="relative">
      <div className="flex justify-between items-center py-5 px-9">
        <div className="mx-auto">
          <Header />
        </div>
        <SignupBtn />
      </div>

      <div className="w-screen h-px bg-gray-600" />

      <div className="px-36">
        <h1 className="text-6xl font-semibold mt-7">
          درباره
          <span className="text-blue-500"> ما</span>
        </h1>
        <p className="text-pretty mt-8">اگر قصد سفر دارید و به دنبال تجربه شایسته سفر هستید، یافتن اقامتگاهی مناسب از نخستین اقدامات شما باید باشد. باما، معتبرترین سامانه رزرو و اجاره اقامتگاه است. در سفرهای داخلی و خارجی، باما انتخاب‌های متنوعی را در اختیارتان می‌گذارد. اطلاعات درباره شرایط اقامتگاه، موقعیت مکانی، عکس‌هایی واضح و هزینه اقامت، داده‌هایی است که در باما در اختیار شما گذاشته می‌شود تا انتخاب آگاهانه‌ای داشته باشید. علاوه بر این، پوشش سراسری اقامتگاه‌ها در ایران، به شما کمک می‌کند تا با تنوع قابل‌توجهی از اقامتگاه روبه‌رو شوید.</p>

        <h2 className="text-4xl font-black mt-28"> ارزش‌های سازمانی </h2>
        <p className="text-pretty mt-8">
          همان‌گونه که هر جامعه‌ای ارزش‌های خاص خود را دارد، جاباما هم ارزش‌هایی دارد که حفظ و ترویج آن‌ها موجب انسجام و تمایز آن از سایر سازمان‌ها می‌گردد. با ملاحظه فلسفه فکری مدیران شرکت و همچنین شخصیت کارکنان آن، ایجاد فضایی که در آن تمامی تفاوت‌ها در کانون رشد و بقای سازمان معنا پیدا کند بسیار حائز اهمیت بوده و بنابراین ما سازمان را با رعایت ارزش‌هایی که از فرهنگ آن می‌آید غنی خواهیم کرد.
        </p>

        <table className="w-full border-collapse mt-8 text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="font-semibold text-right px-4 py-3 pr-8">ارزش&zwnj;ها</th>
              <th className="font-semibold text-right px-4 py-3">توضیحات</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>روابط شبکه&zwnj;&shy;ای</div>
              </td>
              <td className="text-right px-4 py-3">ما به دنبال برقراری روابط میان فردی فراتر از سمت، سطح و واحد جهت آشنایی با تجارب و تخصص همدیگر و افزایش سرمایه اجتماعی سازمان هستیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>تعهد حرفه&shy;&zwnj;ای</div>
              </td>
              <td className="text-right px-4 py-3">ما به دنبال ارزیابی تعهد، در تمامی ابعاد آن بوده و به دنبال ارزش افزوده دو طرفه برای سازمان و همکارانمان هستیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>توانمندسازی</div>
              </td>
              <td className="text-right px-4 py-3">ما به دنبال ارتقای دائمی دانش و مهارت&zwnj;&shy;ها در ابعاد رفتاری و شغلی و بهینه&zwnj;&shy;سازی توانایی&zwnj;&shy;ها در راستانی نیازهای سازمان هستیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>توسعه و تعالی</div>
              </td>
              <td className="text-right px-4 py-3">ما به دنبال تسهیل تعالی سازمان هستیم تا آنکه زمینه تعالی واحدهای سازمانی و خود را فراهم سازیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>تیم&zwnj;سازی بهینه</div>
              </td>
              <td className="text-right px-4 py-3">ما برای ایده&zwnj;&shy;های خود به دنبال تیمی خواهیم بود تا آن را به عمل رسانده و تبدیل به محصول کنیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>کار با حال خوش</div>
              </td>
              <td className="text-right px-4 py-3">تمامی کارها برای لذت بردن از انجام و از آن مهم&shy;تر برای لذت دیدن حال خوش همکاران انجام می&zwnj;&shy;شود.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>حرمت کلام</div>
              </td>
              <td className="text-right px-4 py-3">ما برای انجام وظایف&zwnj;مان منتظر کلمات هستیم، نه دستورالعمل و نامه رسمی، درست مانند یک خانواده.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>حساسیت و پاسخگویی به نیاز مشتریان و کارکنان</div>
              </td>
              <td className="text-right px-4 py-3">تمامی اعضای سازمان شنوا و بینای همدیگر و مشتریان هستند تا کوچکترین خواسته&shy;&zwnj;های آن&shy;&zwnj;ها هم بی&zwnj;جواب نماند.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>ایده و خلق راهکار</div>
              </td>
              <td className="text-right px-4 py-3">ما به دنبال نظراتی هستیم که در آن حوزه تخصص و تجربه&shy; داریم و می&shy;&zwnj;توانیم راهی برای رفع مشکلات یا توسعه قوت&shy;&zwnj;ها ارائه کنیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>روحیه پیشرویی</div>
              </td>
              <td className="text-right px-4 py-3">ما هیچگاه متوقف نخواهیم شد و تمامی همه چیز را می&shy;&zwnj;خواهیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>رهبری تسهیل&shy;&shy;&zwnj;گرانه</div>
              </td>
              <td className="text-right px-4 py-3">رهبران سازمان مدیران و سرپرستانی هستند که از تجارب و حمایت&shy;&zwnj;های خود برای تسهیل و پیشبرد آن استفاده می&zwnj;کنند.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>سازمان دوستانه</div>
              </td>
              <td className="text-right px-4 py-3">سازمان ما قبیله&shy;&zwnj;ای است که اعضای آن در جامعه&shy; ملاحظه&shy;&zwnj;گر و هواخواه آن، کار می&zwnj;&shy;کنند.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>عاملیت</div>
              </td>
              <td className="text-right px-4 py-3">تمامی اعضای سازمان خود را مسئول انجام و عدم انجام کارهای خود در تمام مدت زندگی کاری&zwnj;شان می&shy;&zwnj;دانند.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>با هم کار کردن</div>
              </td>
              <td className="text-right px-4 py-3">ما کارهایی که می&zwnj;&shy;توانیم باهم انجام دهیم را به صورت انفرادی انجام نداده و از با هم بودن لذت می&zwnj;&shy;بریم</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>گفت و شنود</div>
              </td>
              <td className="text-right px-4 py-3">ما، در سازمان منتظر نمی نشینیم تا مشکلات حاد یا خوبی&zwnj;ها خود به خود از بین بروند، بلکه به سرعت پیگیر رفع یا توسعه آن&zwnj;ها خواهیم بود، همچنین گفته ها را می&zwnj;شنویم و به دنبال تفسیر نیستیم و خود نیز منظورمان را واضح و بدون تفسیر بیان می کنیم.</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="text-right px-4 py-3 pr-8">
                <div>مربی&shy;گری</div>
              </td>
              <td className="text-right px-4 py-3">رهبران سازمان اعضای تیم&shy;&shy;&zwnj;های خود را برای انجام وظایف&zwnj;شان رشد داده و بستر انجام وظایف آن&shy;ها را فراهم می&shy;&zwnj;کنیم.</td>
            </tr>
            <tr>
              <td className="text-right px-4 py-3 pr-8">
                <div>همدلی</div>
              </td>
              <td className="text-right px-4 py-3">ما با منطق، تحلیل و تصمیم عمل می&shy; نماییم و آن را با کمک و یاری یکدیگر به ثمر می&zwnj;&shy;رسانیم.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  )
}

export default About