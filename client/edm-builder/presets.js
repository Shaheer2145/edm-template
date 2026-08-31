// Preset Email Templates for EDM Builder
const Presets = {
  "alfursan-gold-en": {
    settings: {
      backgroundColor: "#e9e4d8",
      bodyBackgroundColor: "#ffffff",
      width: 660,
      fontFamily: "Arial, sans-serif",
      textColor: "#272525", 
      direction: "ltr",
      customFonts: []
    },
    sections: [
      // 1. Membership Number Bar
      {
        id: "sec_membership",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_mem_num",
                type: "membership",
                content: {
                  label: "Membership Number:",
                  tag: "{{AlfursanMembershipID}}"
                },
                styles: {
                  fontSize: 10,
                  color: "#000000",
                  textAlign: "left",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 2. Banner Area
      {
        id: "sec_banner",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_logo_img",
                type: "image",
                content: {
                  src: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/41ebf1de-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973356975278",
                  alt: "Saudia Al Fursan Logo",
                  href: "https://www.saudia.com"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              },
              {
                id: "el_hero_img",
                type: "image",
                content: {
                  src: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/103575aa-d967-f111-ab0c-7c1e52faff36?ts=639170288015414637",
                  alt: "Saudia Summer Campaign Banner",
                  href: "https://www.saudia.com"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 3. Body Text & Greeting
      {
        id: "sec_body",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_greeting",
                type: "text",
                content: {
                  text: "Hello <strong>{{FirstName}}</strong>,"
                },
                styles: {
                  fontSize: 14,
                  color: "#272525",
                  textAlign: "left",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_body_copy",
                type: "text",
                content: {
                  text: "This summer, discover extraordinary destinations around the world. Whether you're seeking the serenity of sun-soaked beaches or the energy of vibrant cities, make your next journey even more rewarding with <strong>50% bonus Tier Credits and 10% off</strong> when you book your international flight with Saudia using <strong>promo code: AlFursan</strong><br><br>Pick your destination and live every moment ForLife."
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "left",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_travel_details",
                type: "text",
                content: {
                  text: "<strong>Booking Period: </strong> From 14 till 20 June 2026.<br><br><strong>Travel Period: </strong> From 20 June till 23 August 2026."
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "left",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_signoff",
                type: "text",
                content: {
                  text: "AlFursan<br>ForLife"
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "left",
                  lineHeight: 130,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              }
            ]
          }
        ]
      },
      // 4. Social media background bar
      {
        id: "sec_social",
        settings: {
          backgroundColor: "#a7833e",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_social_icons",
                type: "social",
                content: {
                  youtube: "https://youtube.com/@saudia",
                  snapchat: "https://www.snapchat.com/add/saudia_airlines",
                  facebook: "https://www.facebook.com/SaudiArabianAirlines",
                  telegram: "https://telegram.me/saudia_airlines",
                  twitter: "https://twitter.com/Saudi_Airlines",
                  linkedin: "https://www.linkedin.com/company/saudi-arabian-airlines/",
                  tiktok: "https://www.tiktok.com/@saudia_airlines",
                  instagram: "https://instagram.com/saudi_airlines"
                },
                styles: {
                  iconSize: 40,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 5. Terms & Conditions
      {
        id: "sec_terms",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_terms_title",
                type: "text",
                content: {
                  text: "Terms and conditions"
                },
                styles: {
                  fontSize: 18,
                  color: "#000000",
                  textAlign: "left",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_terms_list",
                type: "text",
                content: {
                  text: "<span style=\"color:#0c311b; font-weight:bold;\">From the Kingdom of Saudi Arabia to all international destinations.</span><br><br>• This offer applies to one-way and round-trip flights in Guest and Business Class.<br><br>• AlFursan members must be “Logged in” to their account to benefit from the offer.<br><br>• Seats are subject to availability, and the offer may not apply to all flights.<br><br>• The offer applies to all international flights operated and marketed by Saudia."
                },
                styles: {
                  fontSize: 12,
                  color: "#0c311b",
                  textAlign: "left",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 6. Footer Unsubscribe & Legal
      {
        id: "sec_footer",
        settings: {
          backgroundColor: "#e9e4d8",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_footer_links",
                type: "text",
                content: {
                  text: "<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">MY ACCOUNT</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">PRIVACY POLICY</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">TERMS & CONDITIONS</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">FAQS</a>&nbsp;|&nbsp;<a href=\"{{Preferencecenter}}\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">UNSUBSCRIBE</a>"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_footer_disclaimer",
                type: "text",
                content: {
                  text: "This email has been sent to you by Saudia Group. We will only disclose your data to our trusted partners for the purpose of operating the AlFursan program or if you have opted-in to receive offers and services from Saudia Group partners. To unsubscribe, simply log in to your account and update your communication preferences or <a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-weight:bold;\">click here.</a>"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_footer_address",
                type: "text",
                content: {
                  text: "<a href=\"{{Companyaddress}}\" style=\"color:#0c311b !important; text-decoration:none !important; font-weight:bold;\">Saudi Airlines</a> Headquarter, Jeddah City, Kingdom Of Saudi Arabia"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "alfursan-gold-ar": {
    settings: {
      backgroundColor: "#e9e4d8",
      bodyBackgroundColor: "#ffffff",
      width: 660,
      fontFamily: "Arial, sans-serif",
      textColor: "#272525",
      direction: "rtl",
      customFonts: []
    },
    sections: [
      // 1. Membership Number Bar
      {
        id: "sec_membership_ar",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_mem_num_ar",
                type: "membership",
                content: {
                  label: "رقم العضوية:",
                  tag: "{{AlfursanMembershipID}}"
                },
                styles: {
                  fontSize: 10,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 2. Banner Area
      {
        id: "sec_banner_ar",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_logo_img_ar",
                type: "image",
                content: {
                  src: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/bc7204e5-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973479321795",
                  alt: "Saudia Al Fursan Arabic Logo",
                  href: "https://www.saudia.com"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              },
              {
                id: "el_hero_img_ar",
                type: "image",
                content: {
                  src: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/0f3575aa-d967-f111-ab0c-7c1e52faff36?ts=639170288015414637",
                  alt: "Saudia Campaign Arabic Banner",
                  href: "https://www.saudia.com"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 3. Body Text & Greeting
      {
        id: "sec_body_ar",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_greeting_ar",
                type: "text",
                content: {
                  text: "مرحبًا <strong>{{FirstName}}</strong>،"
                },
                styles: {
                  fontSize: 14,
                  color: "#272525",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_body_copy_ar",
                type: "text",
                content: {
                  text: "وجهات العالم بانتظارك هذا الصيف. سواء كنت تبحث عن هدوء الشواطئ أو حيوية المدن، اختر رحلتك القادمة واستمتع بـ <strong>50% أميال رصيد مستوى إضافية وخصم 10%</strong> عند حجز رحلتك الدولية على السعودية باستخدام <strong>الرمز الترويجي: AlFursan</strong><br><br>احجز وجهتك الصيفية وعِش أجواءها لذكريات تبقى معاك."
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_travel_details_ar",
                type: "text",
                content: {
                  text: "<strong>فترة الحجز: </strong> من 14 حتى 20 يونيو 2026.<br><br><strong>فترة السفر: </strong> من 20 يونيو إلى 23 أغسطس 2026."
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_signoff_ar",
                type: "text",
                content: {
                  text: "الفرسان<br>تبقى معاك"
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 130,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              }
            ]
          }
        ]
      },
      // 4. Social media background bar
      {
        id: "sec_social_ar",
        settings: {
          backgroundColor: "#a7833e",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_social_icons_ar",
                type: "social",
                content: {
                  youtube: "https://youtube.com/@saudia",
                  snapchat: "https://www.snapchat.com/add/saudia_airlines",
                  facebook: "https://www.facebook.com/SaudiArabianAirlines",
                  telegram: "https://telegram.me/saudia_airlines",
                  twitter: "https://twitter.com/Saudi_Airlines",
                  linkedin: "https://www.linkedin.com/company/saudi-arabian-airlines/",
                  tiktok: "https://www.tiktok.com/@saudia_airlines",
                  instagram: "https://instagram.com/saudi_airlines"
                },
                styles: {
                  iconSize: 40,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 5. Terms & Conditions
      {
        id: "sec_terms_ar",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_terms_title_ar",
                type: "text",
                content: {
                  text: "الشروط والأحكام"
                },
                styles: {
                  fontSize: 18,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_terms_list_ar",
                type: "text",
                content: {
                  text: "<span style=\"color:#0c311b; font-weight:bold;\">من المملكة العربية السعودية إلى جميع الوجهات الدولية.</span><br><br>• يطبّق هذا العرض على رحلات الذهاب والعودة والرحلات ذات الاتجاه الواحد على درجتي الضيافة والأعمال.<br><br>• يجب تسجيل الدخول إلى حساب الفرسان للاستفادة من العرض.<br><br>• المقاعد محدودة وتخضع للتوافر، وقد لا يطبّق العرض على بعض الرحلات.<br><br>• يطبّق العرض على الرحلات الدولية التي تشغلها وتسوقها السعودية فقط."
                },
                styles: {
                  fontSize: 12,
                  color: "#0c311b",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 6. Footer Unsubscribe & Legal
      {
        id: "sec_footer_ar",
        settings: {
          backgroundColor: "#e9e4d8",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_footer_links_ar",
                type: "text",
                content: {
                  text: "<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">حسابي</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">سياسة الخصوصية</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">الشروط والأحكام</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">الأسئلة الشائعة</a>&nbsp;|&nbsp;<a href=\"{{Preferencecenter}}\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">إلغاء الاشتراك</a>"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_footer_disclaimer_ar",
                type: "text",
                content: {
                  text: "تم إرسال هذا البريد الإلكتروني إليك من قبل مجموعة السعودية. لن نفصح عن بياناتك إلا لشركائنا الموثوقين لغرض تشغيل برنامج الفرسان أو إذا كنت قد اخترت تلقي العروض والخدمات من شركاء مجموعة السعودية. لإلغاء الاشتراك، ما عليك سوى تسجيل الدخول إلى حسابك وتتحديث تفضيلات الاتصال الخاصة بك أو <a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-weight:bold;\">اضغط هنا.</a>"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_footer_address_ar",
                type: "text",
                content: {
                  text: "المقر الرئيسي <a href=\"{{Companyaddress}}\" style=\"color:#0c311b !important; text-decoration:none !important; font-weight:bold;\">للخطوط السعودية</a>، مدينة جدة، المملكة العربية السعودية"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "alfursan-gold-ur": {
    settings: {
      backgroundColor: "#e9e4d8",
      bodyBackgroundColor: "#ffffff",
      width: 660,
      fontFamily: "Arial, sans-serif",
      textColor: "#272525",
      direction: "rtl",
      customFonts: []
    },
    sections: [
      // 1. Membership Number Bar
      {
        id: "sec_membership_ur",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_mem_num_ur",
                type: "membership",
                content: {
                  label: "ممبرشپ نمبر:",
                  tag: "{{AlfursanMembershipID}}"
                },
                styles: {
                  fontSize: 10,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 2. Banner Area
      {
        id: "sec_banner_ur",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_logo_img_ur",
                type: "image",
                content: {
                  src: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/41ebf1de-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973356975278", // Standard logo
                  alt: "Saudia Al Fursan Logo",
                  href: "https://www.saudia.com"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              },
              {
                id: "el_hero_img_ur",
                type: "image",
                content: {
                  src: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/103575aa-d967-f111-ab0c-7c1e52faff36?ts=639170288015414637", // Standard banner
                  alt: "Saudia Summer Campaign Banner",
                  href: "https://www.saudia.com"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 3. Body Text & Greeting
      {
        id: "sec_body_ur",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_greeting_ur",
                type: "text",
                content: {
                  text: "محترم <strong>{{FirstName}}</strong>،"
                },
                styles: {
                  fontSize: 14,
                  color: "#272525",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_body_copy_ur",
                type: "text",
                content: {
                  text: "اس گرمی، دنیا بھر میں غیر معمولی مقامات دریافت کریں۔ چاہے آپ دھوپ سے نہائے ہوئے ساحلوں کا سکون چاہتے ہوں یا متحرک شہروں کی توانائی، سعودی کے ساتھ اپنی اگلی بین الاقوامی پرواز بک کر کے اپنے سفر کو مزید فائدہ مند بنائیں جس پر آپ کو ملے گا <strong>50% اضافی ٹیئر کریڈٹ اور 10% ڈسکاؤنٹ</strong>۔ پرومو کوڈ استعمال کریں: <strong>AlFursan</strong><br><br>اپنی منزل کا انتخاب کریں اور ہر لمحہ زندگی بھر کے لیے جییں۔"
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_travel_details_ur",
                type: "text",
                content: {
                  text: "<strong>بکنگ کی مدت: </strong> 14 سے 20 جون 2026 تک۔<br><br><strong>سفر کی مدت: </strong> 20 جون سے 23 اگست 2026 تک۔"
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              },
              {
                id: "el_signoff_ur",
                type: "text",
                content: {
                  text: "الفرسان<br>زندگی بھر کے لیے"
                },
                styles: {
                  fontSize: 14,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 130,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              }
            ]
          }
        ]
      },
      // 4. Social media background bar
      {
        id: "sec_social_ur",
        settings: {
          backgroundColor: "#a7833e",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_social_icons_ur",
                type: "social",
                content: {
                  youtube: "https://youtube.com/@saudia",
                  snapchat: "https://www.snapchat.com/add/saudia_airlines",
                  facebook: "https://www.facebook.com/SaudiArabianAirlines",
                  telegram: "https://telegram.me/saudia_airlines",
                  twitter: "https://twitter.com/Saudi_Airlines",
                  linkedin: "https://www.linkedin.com/company/saudi-arabian-airlines/",
                  tiktok: "https://www.tiktok.com/@saudia_airlines",
                  instagram: "https://instagram.com/saudi_airlines"
                },
                styles: {
                  iconSize: 40,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 5. Terms & Conditions
      {
        id: "sec_terms_ur",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 45,
          paddingRight: 45
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_terms_title_ur",
                type: "text",
                content: {
                  text: "شرائط و ضوابط"
                },
                styles: {
                  fontSize: 18,
                  color: "#000000",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_terms_list_ur",
                type: "text",
                content: {
                  text: "<span style=\"color:#0c311b; font-weight:bold;\">سعودی عرب سے تمام بین الاقوامی مقامات کے لیے۔</span><br><br>• یہ پیشکش گیسٹ اور بزنس کلاس میں یکطرفہ اور واپسی کی پروازوں پر لاگو ہوتی ہے۔<br><br>• پیشکش سے فائدہ اٹھانے کے لیے الفرسان ممبرز کا اپنے اکاؤنٹ میں لاگ ان ہونا ضروری ہے۔<br><br>• نشستیں دستیابی سے مشروط ہیں، اور پیشکش تمام پروازوں پر لاگو نہیں ہو سکتی۔<br><br>• یہ پیشکش سعودی ایئر لائنز کی طرف سے چلائی جانے والی تمام پروازوں پر لاگو ہوتی ہے۔"
                },
                styles: {
                  fontSize: 12,
                  color: "#0c311b",
                  textAlign: "right",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // 6. Footer Unsubscribe & Legal
      {
        id: "sec_footer_ur",
        settings: {
          backgroundColor: "#e9e4d8",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "el_footer_links_ur",
                type: "text",
                content: {
                  text: "<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">میرا اکاؤنٹ</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">پرائیویسی پالیسی</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">شرائط و ضوابط</a>&nbsp;|&nbsp;<a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">اکثر پوچھے گئے سوالات</a>&nbsp;|&nbsp;<a href=\"{{Preferencecenter}}\" style=\"text-decoration:none; color:#0c311b; font-size:9px; font-weight:bold;\">ان سبسکرائب کریں</a>"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_footer_disclaimer_ur",
                type: "text",
                content: {
                  text: "یہ ای میل آپ کو سعودی گروپ کی طرف سے بھیجی گئی ہے۔ ہم آپ کا ڈیٹا صرف اپنے قابل اعتماد شراکت داروں کو الفرسان پروگرام چلانے کے مقصد کے لیے ظاہر کریں گے یا اگر آپ نے سعودی گروپ کے شراکت داروں سے پیشکشیں حاصل کرنا قبول کیا ہو۔ ان سبسکرائب کرنے کے لیے، اپنے اکاؤنٹ میں لاگ ان کریں اور اپنی ترجیحات کو اپ ڈیٹ کریں یا <a href=\"#\" style=\"text-decoration:none; color:#0c311b; font-weight:bold;\">یہاں کلک کریں۔</a>"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "el_footer_address_ur",
                type: "text",
                content: {
                  text: "<a href=\"{{Companyaddress}}\" style=\"color:#0c311b !important; text-decoration:none !important; font-weight:bold;\">سعودی ایئر لائنز</a> ہیڈ کوارٹر، جدہ سٹی، سعودی عرب"
                },
                styles: {
                  fontSize: 10,
                  color: "#0c311b",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "basic-newsletter": {
    settings: {
      backgroundColor: "#f3f4f6",
      bodyBackgroundColor: "#ffffff",
      width: 600,
      fontFamily: "Helvetica, Arial, sans-serif",
      textColor: "#374151",
      direction: "ltr",
      customFonts: []
    },
    sections: [
      {
        id: "nl_sec_header",
        settings: {
          backgroundColor: "#1f2937",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "nl_el_header_text",
                type: "text",
                content: {
                  text: "<span style=\"color:#ffffff; font-size:20px; font-weight:bold; letter-spacing:1px;\">WEEKLY CHRONICLE</span>"
                },
                styles: {
                  fontSize: 20,
                  color: "#ffffff",
                  textAlign: "center",
                  lineHeight: 110,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      {
        id: "nl_sec_hero",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "nl_el_hero_img",
                type: "image",
                content: {
                  src: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80",
                  alt: "Workspace banner",
                  href: "#"
                },
                styles: {
                  width: 600,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      {
        id: "nl_sec_content",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "nl_el_title",
                type: "text",
                content: {
                  text: "Boost Your Productivity This Week"
                },
                styles: {
                  fontSize: 22,
                  color: "#111827",
                  textAlign: "left",
                  lineHeight: 120,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "nl_el_body",
                type: "text",
                content: {
                  text: "We have curated the best tools, tips, and articles to help you work smarter, not harder. Discover the 5-step morning routine used by top creators, how to block distracting websites, and ways to organize your desktop for maximum cognitive ease."
                },
                styles: {
                  fontSize: 15,
                  color: "#4b5563",
                  textAlign: "left",
                  lineHeight: 140,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 25
                }
              },
              {
                id: "nl_el_btn",
                type: "button",
                content: {
                  text: "Read the Article",
                  href: "https://example.com/blog/productivity"
                },
                styles: {
                  fontSize: 16,
                  color: "#ffffff",
                  backgroundColor: "#6366f1",
                  borderRadius: 6,
                  alignment: "center",
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontWeight: "bold"
                }
              }
            ]
          }
        ]
      },
      {
        id: "nl_sec_footer",
        settings: {
          backgroundColor: "#f9fafb",
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "nl_el_social",
                type: "social",
                content: {
                  facebook: "https://facebook.com",
                  twitter: "https://twitter.com",
                  instagram: "https://instagram.com"
                },
                styles: {
                  iconSize: 32,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "nl_el_footer_text",
                type: "text",
                content: {
                  text: "© 2026 Your Company. All rights reserved.<br>123 Innovation Way, Tech District.<br><br><a href=\"#\" style=\"color:#6b7280; text-decoration:underline;\">Unsubscribe</a> from this list."
                },
                styles: {
                  fontSize: 11,
                  color: "#9ca3af",
                  textAlign: "center",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "product-promo": {
    settings: {
      backgroundColor: "#f8fafc",
      bodyBackgroundColor: "#ffffff",
      width: 660,
      fontFamily: "Arial, sans-serif",
      textColor: "#334155",
      direction: "ltr",
      customFonts: []
    },
    sections: [
      // Logo / Header
      {
        id: "pr_sec_hdr",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "pr_el_logo",
                type: "text",
                content: {
                  text: "<span style=\"font-size:24px; font-weight:bold; color:#0f172a;\">NEXUS</span>"
                },
                styles: {
                  fontSize: 24,
                  color: "#0f172a",
                  textAlign: "center",
                  lineHeight: 100,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // Hero Image
      {
        id: "pr_sec_hero",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "pr_el_hero_img",
                type: "image",
                content: {
                  src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=660&q=80",
                  alt: "Premium Headphones Showcase",
                  href: "#"
                },
                styles: {
                  width: 660,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      },
      // Intro Text
      {
        id: "pr_sec_intro",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 30,
          paddingBottom: 10,
          paddingLeft: 40,
          paddingRight: 40
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "pr_el_intro_title",
                type: "text",
                content: {
                  text: "Introducing Nexus SoundPro"
                },
                styles: {
                  fontSize: 26,
                  color: "#0f172a",
                  textAlign: "center",
                  lineHeight: 120,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              },
              {
                id: "pr_el_intro_desc",
                type: "text",
                content: {
                  text: "Experience sound in its purest form. Active Noise Cancellation, 40-hour battery life, and handcrafted memory foam cushions. Read below to see what makes SoundPro the audio choice of the decade."
                },
                styles: {
                  fontSize: 15,
                  color: "#475569",
                  textAlign: "center",
                  lineHeight: 140,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 20
                }
              }
            ]
          }
        ]
      },
      // 2 Column Features Grid
      {
        id: "pr_sec_features",
        settings: {
          backgroundColor: "#ffffff",
          paddingTop: 10,
          paddingBottom: 30,
          paddingLeft: 30,
          paddingRight: 30
        },
        columns: [
          {
            width: 50,
            elements: [
              {
                id: "pr_el_f1_img",
                type: "image",
                content: {
                  src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=280&q=80",
                  alt: "ANC feature description",
                  href: "#"
                },
                styles: {
                  width: 280,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              },
              {
                id: "pr_el_f1_title",
                type: "text",
                content: {
                  text: "Pure ANC"
                },
                styles: {
                  fontSize: 18,
                  color: "#0f172a",
                  textAlign: "center",
                  lineHeight: 120,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 6
                }
              },
              {
                id: "pr_el_f1_desc",
                type: "text",
                content: {
                  text: "Block the world out. Active noise cancellation senses and blocks ambient noise."
                },
                styles: {
                  fontSize: 13,
                  color: "#64748b",
                  textAlign: "center",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              }
            ]
          },
          {
            width: 50,
            elements: [
              {
                id: "pr_el_f2_img",
                type: "image",
                content: {
                  src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=280&q=80",
                  alt: "Fast charging description",
                  href: "#"
                },
                styles: {
                  width: 280,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              },
              {
                id: "pr_el_f2_title",
                type: "text",
                content: {
                  text: "Fast Charge"
                },
                styles: {
                  fontSize: 18,
                  color: "#0f172a",
                  textAlign: "center",
                  lineHeight: 120,
                  fontWeight: "bold",
                  paddingTop: 0,
                  paddingBottom: 6
                }
              },
              {
                id: "pr_el_f2_desc",
                type: "text",
                content: {
                  text: "Get 5 hours of rich playback from just a quick 10-minute USB-C charge."
                },
                styles: {
                  fontSize: 13,
                  color: "#64748b",
                  textAlign: "center",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              }
            ]
          }
        ]
      },
      // CTA Area
      {
        id: "pr_sec_cta",
        settings: {
          backgroundColor: "#0f172a",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 40,
          paddingRight: 40
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "pr_el_cta_text",
                type: "text",
                content: {
                  text: "<span style=\"color:#ffffff;\">GET YOURS TODAY</span><br><h2 style=\"color:#ffffff; margin:5px 0 15px 0; font-size:22px;\">Save 15% on Launch Week</h2>"
                },
                styles: {
                  fontSize: 14,
                  color: "#ffffff",
                  textAlign: "center",
                  lineHeight: 120,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 10
                }
              },
              {
                id: "pr_el_cta_btn",
                type: "button",
                content: {
                  text: "Buy SoundPro",
                  href: "https://example.com/buy"
                },
                styles: {
                  fontSize: 15,
                  color: "#0f172a",
                  backgroundColor: "#f8fafc",
                  borderRadius: 4,
                  alignment: "center",
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 30,
                  paddingRight: 30,
                  fontWeight: "bold"
                }
              }
            ]
          }
        ]
      },
      // Socials & Footer
      {
        id: "pr_sec_ftr",
        settings: {
          backgroundColor: "#f1f5f9",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 40,
          paddingRight: 40
        },
        columns: [
          {
            width: 100,
            elements: [
              {
                id: "pr_el_soc",
                type: "social",
                content: {
                  instagram: "https://instagram.com",
                  facebook: "https://facebook.com",
                  linkedin: "https://linkedin.com"
                },
                styles: {
                  iconSize: 32,
                  alignment: "center",
                  paddingTop: 0,
                  paddingBottom: 15
                }
              },
              {
                id: "pr_el_ftr_text",
                type: "text",
                content: {
                  text: "Nexus Electronics Inc. | 400 Silicon Parkway, Suite 100, San Jose, CA.<br>You are receiving this because you subscribed on our site. <a href=\"#\" style=\"color:#475569; text-decoration:underline;\">Unsubscribe</a>"
                },
                styles: {
                  fontSize: 11,
                  color: "#64748b",
                  textAlign: "center",
                  lineHeight: 130,
                  fontWeight: "normal",
                  paddingTop: 0,
                  paddingBottom: 0
                }
              }
            ]
          }
        ]
      }
    ]
  }
};

export { Presets };
export default Presets;
