import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'VỀ'} text2={'CHÚNG TÔI'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>THEBOY được sinh ra từ niềm đam mê đổi mới và mong muốn cách mạng hóa cách người ta mua sắm trực tuyến. Hành trình của chúng tôi bắt đầu với một ý tưởng đơn giản: cung cấp một nền tảng nơi khách hàng có thể dễ dàng khám phá, tìm hiểu và mua một loạt các sản phẩm từ sự thoải mái của ngôi nhà của họ.</p>
              <p>Kể từ khi thành lập, chúng tôi đã làm việc không ngừng để tuyển chọn một bộ sưu tập đa dạng các sản phẩm chất lượng cao đáp ứng mọi khẩu vị và sở thích. Từ thời trang và sắc đẹp đến điện tử và đồ dùng gia đình, chúng tôi cung cấp một bộ sưu tập rộng rãi được lấy từ các thương hiệu và nhà cung cấp tin cậy.</p>
              <b className='text-gray-800'>Sứ Mệnh Của Chúng Tôi</b>
              <p>Sứ mệnh của THEBOY là trao quyền cho khách hàng với sự lựa chọn, tiện lợi, và tự tin. Chúng tôi cam kết cung cấp một trải nghiệm mua sắm liền mạch vượt quá mong đợi, từ duyệt và đặt hàng đến giao hàng và hơn thế nữa.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'TẠI SAO'} text2={'CHỌN CHÚNG TÔI'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Đảm Bảo Chất Lượng:</b>
            <p className=' text-gray-600'>Chúng tôi lựa chọn và kiểm tra kỹ lưỡng từng sản phẩm để đảm bảo chúng đáp ứng các tiêu chuẩn chất lượng nghiêm ngặt của chúng tôi.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Tiện Lợi:</b>
            <p className=' text-gray-600'>Với giao diện người dùng thân thiện và quy trình đặt hàng không phức tạp, mua sắm chưa bao giờ dễ dàng hơn.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Dịch Vụ Khách Hàng Xuất Sắc:</b>
            <p className=' text-gray-600'>Đội ngũ chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn trên suốt chặng đường, đảm bảo sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
