import { IArticlesListingResponseDto, IFavoritesArticlesListingResponseDto, IMostViewedArticlesResponseDto, IToggleFavoriteArticleResponseDto } from "../dtos";

// export const mockArticlesListing: IPaginationResponse<IArticlesListingResponseDto> = {
export const mockArticlesListing: IArticlesListingResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "data": [
      {
        "id": 7,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "كيف يؤثر الغذاء على الصحة النفسية ؟",
        "description": "<div style=\"text-align: justify;\"><font color=\"#262626\" face=\"Droid Arabic Kufi, sans-serif\"><span style=\"font-size: 18px;\">...</span></font></div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-13T21:38:34.000000Z",
        "new": false
      },
      {
        "id": 8,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "الغذاء الصحي.. علاقة وثيقة بتحسين الصحة النفسية",
        "description": "<div>الغذاء الصحي.. علاقة وثيقة بتحسين الصحة النفسية</div><div>التغذية السليمة تلعب دورًا محوريًا في تعزيز الصحة العقلية، حيث يشكّل \"الطب النفسي الغذائي\" نهجًا مبتكرًا يقدم الأمل في الوقاية من اضطرابات الصحة العقلية وعلاجها بتحسين العادات الغذائية.</div><div><br></div><div>أظهرت الأبحاث أهمية النظام الغذائي المتكون من الفواكه، الخضروات، الأسماك، الحبوب الكاملة، وزيت الزيتون. يُلاحظ أن مرضى السكري، الذين يتأثرون بشكل كبير بنوعية غذائهم، يعانون من معدلات أعلى للاكتئاب والقلق. وُجد أيضًا أن أولئك الذين خضعوا لأنظمة غذائية صحية قد تحسنت حالتهم من الاكتئاب الشديد بأربعة أضعاف مقارنة بمن حصلوا على دعم اجتماعي فقط.</div><div><br></div><div>من جانب آخر، نقل ميكروبيوتا أمعاء الأشخاص المصابين بالاكتئاب إلى فئران التجارب أثار مؤشرات الاكتئاب والقلق فيها، مما يدل على دور ميكروبيوتا الأمعاء في تأثيرها على الصحة العقلية. النظم الغذائية الفعالة في الوقاية أو علاج اضطرابات الصحة العقلية غالبًا ما تكون غنية بالفواكه، الخضروات، الألياف، والحبوب الكاملة. على الرغم من أهمية اتباع نظم غذائية خاصة لأمراض معينة كأمراض القلب والسكري، لا يُعتمد هذا الأسلوب كثيرًا في علاج اضطرابات الصحة العقلية.</div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-13T21:42:52.000000Z",
        "new": false
      },
      {
        "id": 9,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "التلبينة النبوية فوائدها الروحية والصحية",
        "description": "<div>التلبينة النبوية تعتبر علاجًا تقليديًا موصى به نبويًا لتحسين الحالة النفسية والتخفيف من الاكتئاب، إلى جانب فوائدها الصحية الأخرى. تُصنع هذه الوجبة الغنية من الشعير المحمص المطحون مطهوًا مع الحليب ومُحلى بالعسل. هذا الحساء البسيط كان يُستخدم تقليديًا لتهدئة القلب وتخفيف الحزن.</div><div><br></div><div>تستخلص فوائد التلبينة النبوية في التقليل من الاكتئاب من خلال مكوناتها الغذائية الثرية، والتي تشمل:</div><div><br></div><div>• الكربوهيدرات:</div><div>&nbsp;تتميز التلبينة بمحتواها العالي من الكربوهيدرات، مما يساهم في تحسين المزاج والحالة النفسية عن طريق تعزيز إنتاج السيروتونين.</div><div>• الزنك:&nbsp;</div><div>&nbsp;المعدن الأساسي في التلبينة الذي يُعرف بتأثيره في تقليل أعراض الاكتئاب، حيث أظهرت الدراسات وجود علاقة بين نقص الزنك والإصابة بالاكتئاب.</div><div>• نسبة التربتوفان إلى الأحماض الأمينية متفرعة السلسلة (Trp: BCAA):&nbsp;</div><div>تتميز التلبينة بارتفاع هذه النسبة، مما يزيد من توافر التربتوفان للدماغ، ويساهم في تحسين الصحة العقلية وتقليل الإصابة بالاكتئاب.</div><div><br></div><div>طريقة تحضير التلبينة النبوية:</div><div>• المكونات:</div><div>&nbsp; &nbsp;- 375 ملليليتر من الماء (حوالي كوبين ونصف).</div><div>&nbsp; &nbsp;- 125 غرام من الشعير المطحون (حوالي ربع كوب).</div><div>&nbsp; &nbsp;- 2.5 لتر من الحليب الطازج.</div><div>&nbsp; &nbsp;- ربع كوب من العسل.</div><div>&nbsp; &nbsp;- قليل من المكسرات (اختياري).</div><div><br></div><div>• التحضير:</div><div>&nbsp; &nbsp;- نظف الشعير جيدًا واتركه يجف تمامًا.</div><div>&nbsp; &nbsp;- بعد الجفاف، احمص الشعير ثم اغليه مع الماء.</div><div>&nbsp; &nbsp;- بعد الغليان، اترك الخليط ليبرد ثم صفيه.</div><div>&nbsp; &nbsp;- في كوب، ضع ملعقتين كبيرتين من خليط الشعير وأضف إليها الحليب البارد.</div><div>&nbsp; &nbsp;- أضف العسل وزينها بالمكسرات إن أردت وقدمها باردة.</div><div><br></div><div>هذه الطريقة تضمن الحصول على أقصى فوائد من التلبينة النبوية للتخفيف من الاكتئاب ودعم الصحة النفسية.</div><div><br></div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-13T21:43:10.000000Z",
        "new": false
      },
      {
        "id": 10,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "السلام الداخلي كل ما يهمك",
        "description": "<div><div>التأمل هو ممارسة قديمة تعود جذورها إلى آلاف السنين، تم تطويرها في البداية كجزء من التقاليد الدينية والروحانية في الشرق. في العقود الأخيرة، اكتسب التأمل شعبية عالمية كأداة للرفاهية النفسية والجسدية، بفضل الأبحاث التي أبرزت فوائده المتعددة. يُعرف التأمل بأنه عملية تركيز الذهن على فكرة، كائن، أو النشاط لزيادة الوعي والهدوء وتعزيز الاستقرار العاطفي.</div><div><br></div><div>• فوائد التأمل</div><div><br></div><div>1. تحسين الصحة النفسية:</div><div>&nbsp;التأمل يمكن أن يقلل من التوتر، القلق، وأعراض الاكتئاب. يساعد على تعزيز مزاج أكثر إيجابية ونظرة أكثر تفاؤلاً نحو الحياة.</div><div>2. تعزيز الصحة الجسدية:</div><div>&nbsp;تم ربط التأمل بتحسينات في ضغط الدم، النوم، والاستجابة للألم. يمكن أن يساهم أيضًا في تحسين وظائف الجهاز المناعي.</div><div>3. زيادة الوعي والتركيز:</div><div>&nbsp;التأمل يعزز القدرة على التركيز والانتباه. يساعد على تطوير القدرة على البقاء مركزًا لفترات أطول وتقليل التشتت.</div><div>4. تعزيز الذات:</div><div>&nbsp;من خلال الممارسة المستمرة، يمكن للتأمل أن يساعد في فهم الذات بشكل أعمق، مما يعزز الثقة بالنفس والقبول الذاتي.</div><div>5. إدارة الإجهاد:</div><div>التأمل يعلم كيفية التعامل مع الإجهاد بشكل أكثر فعالية، مما يساعد على تقليل الضغوطات اليومية.</div><div><br></div><div><br></div><div>• أهمية التأمل</div><div><br></div><div>التأمل ليس مجرد تمرين للراحة والاسترخاء؛ إنه يمثل وسيلة لفهم عقلنا وطريقة تفكيرنا بشكل أفضل. من خلال التأمل، يمكننا تطوير مهارة \"المراقبة دون تحيز\" لأفكارنا ومشاعرنا، مما يسمح لنا بالتعامل معها بطريقة أكثر صحة وإنتاجية. هذه العملية تعزز الوعي الذاتي وتساهم في تحقيق السلام الداخلي والتوازن.</div><div><br></div><div>التأمل يعزز أيضًا الصلات العصبية في الدماغ، وخاصة في المناطق المرتبطة بالذاكرة، التركيز، والتحكم العاطفي. هذه التغييرات في الدماغ تساعد على تحسين الأداء الذهني والعاطفي على المدى الطويل.&nbsp;</div><div><br></div><div>___</div><div><br></div><div><br></div><div>العلاقات الاجتماعية وأهميتها</div><div>التواصل الاجتماعي يُعدّ عنصرًا حيويًا لحاجة الإنسان، حيث يميل بطبيعته إلى الانخراط في المجتمع سعيًا وراء الحب، الانتماء، والتقدير. هذه الروابط تمنح مشاعر إيجابية مثل الفرح، السكينة، الأمان، والراحة النفسية، مساهمةً في توازنه النفسي والجسدي.</div><div><br></div><div>في مجال الاجتماع، يُعرف التفاعل الاجتماعي بأنه تصرفات تصدر من مجموعة أشخاص، بحيث تُؤخذ في الاعتبار معاني تصرفات الآخرين. بمعنى آخر، يُمكن وصفه كجسر يربط بين الأفراد والمجموعات، شاملًا جميع أنواع العلاقات مثل الأسرية وتلك ضمن المؤسسات.</div><div><br></div><div>الأثر الإيجابي للكلمة الطيبة على نفسيات الأفراد</div><div><br></div><div>التفاعلات الاجتماعية تتمتع بأهمية كبيرة من خلال:</div><div><br></div><div>- تشجيع بناء العلاقات الإيجابية: تُعتبر هذه العلاقات أساس التفاعل المستمر بين أفراد المجتمع، مُسهلةً الثقة والتعاون المتبادل.</div><div>- دعم الفرد في تحقيق أهدافه: تُعزز الثقة بالنفس وتمكّن من تحقيق الأهداف مع توفير السلام النفسي والراحة، مما يُحسن الإنتاجية والطموح.</div><div>- تعميق الوعي الذاتي وتراكم الخبرات: تُوسع من معرفة الذات، اكتشاف المواهب، واكتساب معارف وخبرات قيمة من تجارب الآخرين.</div><div>- فتح أبواب لتجارب جديدة وتجاوز الخوف: تُشجع على المغامرة وتجاوز المخاوف بدعم من الآخرين.</div><div>- مكافحة الشعور بالعزلة: تُسهم في اندماج الفرد بفاعلية في المجتمع وتقليل الشعور بالوحدة.</div><div>- تحسين جودة الحياة: تُساهم في تكوين الشخصية وتغيير الاعتقادات والمفاهيم حول الحياة، وتُنمي الإخلاص والانتماء.</div><div>- دعم الصحة النفسية والتخفيف من الضغوط: توفر الدعم العاطفي والنفسي الذي يُقلل من التوتر ويُعزز الراحة والهدوء.</div><div><br></div><div>في الختام، التفاعل الاجتماعي يُشكل أساسًا لحياة الفرد، مُحسنًا من جودة الحياة&nbsp;</div><div><br></div></div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-13T22:01:42.000000Z",
        "new": false
      },
      {
        "id": 11,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "العلاقات الاجتماعية وأهميتها",
        "description": "<div>التواصل الاجتماعي يُعدّ عنصرًا حيويًا لحاجة الإنسان، حيث يميل بطبيعته إلى الانخراط في المجتمع سعيًا وراء الحب، الانتماء، والتقدير. هذه الروابط تمنح مشاعر إيجابية مثل الفرح، السكينة، الأمان، والراحة النفسية، مساهمةً في توازنه النفسي والجسدي.</div><div><br></div><div>في مجال الاجتماع، يُعرف التفاعل الاجتماعي بأنه تصرفات تصدر من مجموعة أشخاص، بحيث تُؤخذ في الاعتبار معاني تصرفات الآخرين. بمعنى آخر، يُمكن وصفه كجسر يربط بين الأفراد والمجموعات، شاملًا جميع أنواع العلاقات مثل الأسرية وتلك ضمن المؤسسات.</div><div><br></div><div>الأثر الإيجابي للكلمة الطيبة على نفسيات الأفراد</div><div><br></div><div>التفاعلات الاجتماعية تتمتع بأهمية كبيرة من خلال:</div><div><br></div><div>- تشجيع بناء العلاقات الإيجابية: تُعتبر هذه العلاقات أساس التفاعل المستمر بين أفراد المجتمع، مُسهلةً الثقة والتعاون المتبادل.</div><div>- دعم الفرد في تحقيق أهدافه: تُعزز الثقة بالنفس وتمكّن من تحقيق الأهداف مع توفير السلام النفسي والراحة، مما يُحسن الإنتاجية والطموح.</div><div>- تعميق الوعي الذاتي وتراكم الخبرات: تُوسع من معرفة الذات، اكتشاف المواهب، واكتساب معارف وخبرات قيمة من تجارب الآخرين.</div><div>- فتح أبواب لتجارب جديدة وتجاوز الخوف: تُشجع على المغامرة وتجاوز المخاوف بدعم من الآخرين.</div><div>- مكافحة الشعور بالعزلة: تُسهم في اندماج الفرد بفاعلية في المجتمع وتقليل الشعور بالوحدة.</div><div>- تحسين جودة الحياة: تُساهم في تكوين الشخصية وتغيير الاعتقادات والمفاهيم حول الحياة، وتُنمي الإخلاص والانتماء.</div><div>- دعم الصحة النفسية والتخفيف من الضغوط: توفر الدعم العاطفي والنفسي الذي يُقلل من التوتر ويُعزز الراحة والهدوء.</div><div><br></div><div>في الختام، التفاعل الاجتماعي يُشكل أساسًا لحياة الفرد، مُحسنًا من جودة الحياة&nbsp;</div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-17T18:42:43.000000Z",
        "new": false
      },
      {
        "id": 12,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "لماذا العلاقات الجيدة ضرورية لصحتنا العقلية",
        "description": "<p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">مرارًا وتكرارًا ، قيل إن\r\nالعلاقات الوثيقة هي التي تجعلنا سعداء طوال حياتنا. تحمينا العلاقات الآمنة\r\nوالصحية مع الأصدقاء والعائلة وزملاء العمل في أوقات الشدائد والتغيير وعدم\r\nاليقين. كما أنها تساعدنا على التعافي من المرض واليأس</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;\r\nmso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">إذا كنا محاطين بأشخاص\r\nيحبوننا ويهتمون بنا ، فستكون جميع جوانب صحتنا الجسدية والعاطفية والعقلية أكثر\r\nاستقرارًا ، وفقًا لدراسة أجرتها جامعة هارفارد عام 2012. هذا يعني أن السعادة\r\nوالصحة الجيدة تأتيان إلى حد كبير من علاقاتنا. يعد الاهتمام بعلاقاتك شكلاً من\r\nأشكال الرعاية الذاتية التي لا تقل أهمية عن العناية بصحتك الجسدية</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">في بيئة داعمة ورعاية ،\r\nيشعر الناس بدرجة أقل بالوحدة ، وأقل قلقًا ، وأقل خوفًا من الحياة. نحن نعلم\r\nكيفية الوصول إلى الدعم قبل أن تصبح التحديات ساحقة للغاية ، ويمكننا أن نتعافى من\r\nالشدائد</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:\r\n12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">العلاقات الجيدة ليست\r\nمجرد مكافأة في حياتنا - إنها ضرورية للبقاء بصحة جيدة والبقاء فيها</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><b><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:18.0pt;font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:0pt;mso-ligatures:\r\nnone\">جودة علاقاتنا أكثر أهمية من الكمية</span></b><b><span style=\"font-size:\r\n18.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><o:p></o:p></span></b></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">يمر كل شخص بلحظات قد\r\nتكون فيها العلاقات مع الأصدقاء أو الزملاء أو العائلة أو الشركاء خادعة أو\r\nإشكالية لفترة قصيرة. لا يجب أن تكون العلاقات - ولا يمكن أن تكون -\r\n\"مثالية\" حتى تكون ذات قيمة. الشيء الأكثر أهمية هو أننا نشعر أنه\r\nيمكننا الاعتماد على أحبائنا ليكونوا بجانبنا عندما تصبح الأمور صعبة</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">ومع ذلك ، إذا استمرت\r\nالأمور في التدهور أو ساءت بمرور الوقت ، فيمكننا أن نشعر بالحزن والوحدة\r\nوالانفصال ، حتى عندما نكون محاطين بالناس. الذين يعيشون في صراع أو داخل</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>&nbsp;<a href=\"https://www.relationshipsnsw.org.au/ar/blog/warning-signs-of-toxic-relationships/\" target=\"_blank\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-hansi-font-family:Montserrat;color:blue\">علاقة\r\nسامة</span></a><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span dir=\"LTR\"></span>&nbsp;</span><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:12.0pt;\r\nfont-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">أكثر</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>&nbsp;<a href=\"https://www.mentalhealth.org.uk/sites/default/files/2022-06/MHF-Relationships-21st-Century-Summary-Report.pdf\" target=\"_blank\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-hansi-font-family:Montserrat;color:blue\">مضرة\r\nمن أن تكون بمفردك</span></a><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">يمكن أن يكون لإنهاء\r\nالعلاقات الشخصية الوثيقة تأثير مدمر على الصحة العقلية. تعد الوحدة والعزلة من\r\nالمخاطر الرئيسية بعد انهيار العلاقة ، أو عندما يغادر الأطفال الأكبر سنًا منزل\r\nالأسرة ، أو بعد وفاة شريك</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">يمكن أن يحدث هذا أيضًا\r\nبعد فقدان الوظيفة ، أو بعد التقاعد ، أو فترات بطالة أخرى ، عندما تتضاءل الروابط\r\nاليومية والإيجابية والهادفة</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">نحن نعلم أيضًا أن\r\nاستمرار الصراع بين البالغين في منزل به أطفال لن يسبب إجهادًا للبالغين فقط. كما\r\nيمكن أن يؤثر سلبًا على رفاهية الأطفال ونموهم الطبيعي</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;\r\nmso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">في حالات</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>&nbsp;<a href=\"https://www.relationshipsnsw.org.au/ar/support/services/?focus=domestic-violence\" target=\"_blank\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-hansi-font-family:Montserrat;color:blue\">العنف\r\nالمنزلي</span></a></span><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:12.0pt;\r\nfont-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">عندما يستخدم شخص ما\r\nتكتيكات الخوف والترهيب للسيطرة على شخص آخر ، يمكن تقويض قدرة الضحية على إقامة\r\nعلاقات إيجابية والحفاظ عليها في المستقبل</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;\r\nmso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:12.0pt;font-family:\r\n&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:\r\n0pt;mso-ligatures:none\">يتأثر الأطفال والشباب الذين يشهدون العنف وقد يغادرون\r\nالمنزل مبكرًا قبل أن تتوافر لديهم الموارد اللازمة والكافية ليكونوا مستقلين.\r\nيمكن أن يعاني الأشخاص الذين يستخدمون العنف أحيانًا من مشكلات تتعلق بالصحة العقلية\r\nوسلوكيات إدمان تحتاج إلى معالجة</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><b><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:18.0pt;font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:0pt;mso-ligatures:\r\nnone\">كيف تؤثر الصحة العقلية على علاقاتنا</span></b><b><span style=\"font-size:\r\n18.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><o:p></o:p></span></b></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">مثلما تؤثر علاقاتنا على\r\nصحتنا العقلية ، يمكن أن تؤثر الضائقة العقلية أيضًا على علاقاتنا</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">عندما نكافح مع القلق أو\r\nالاكتئاب أو مشاكل الصحة العقلية الأخرى ، غالبًا ما يكون لدينا اهتمام أقل أو\r\nطاقة أقل لأحبائنا. نجد صعوبة أكبر في المشاركة في الأنشطة التي تربطنا ، ونتيجة\r\nلذلك نجد أنه من الأسهل الانسحاب إلى أنفسنا. بالنسبة للأزواج ، قد يصبح شخص واحد\r\nفي العلاقة بعيدًا وقد يفقد توازن الدعم المتبادل لفترة من الوقت</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:\r\nMontserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:12.0pt;font-family:\r\n&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:\r\n0pt;mso-ligatures:none\">يمكن للأشخاص الذين يعانون من مشاكل الصحة العقلية أن\r\nيشعروا بالخجل ولوم أنفسهم ، مما يؤدي إلى أفكار سلبية ، والتي تعمل ضد مشاعر\r\nالتقارب والتواصل</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><b><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:18.0pt;font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:0pt;mso-ligatures:\r\nnone\">كيف يمكنني تحسين علاقاتي؟</span></b><b><span style=\"font-size:18.0pt;\r\nfont-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:\r\n&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;mso-ligatures:none\"><o:p></o:p></span></b></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">للبدء ، فكر في العلاقات\r\nالتي لديك حاليًا وأنواع العلاقات التي ترغب في تكوينها. على سبيل المثال ، قد\r\nترغب في تكوين صداقات جديدة أو تقوية علاقاتك الحالية</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;\r\nmso-font-kerning:0pt;mso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">إذا كنت ترغب في تقوية\r\nالعلاقات الحالية ، فتواصل مع الأشخاص الذين تعرفهم بالفعل ، مثل زملاء العمل أو\r\nالعائلة أو أصدقاء الأصدقاء أو الجيران. اقترح أنك ترغب في أن تكون على اتصال أكثر\r\nمن مرة ، وتنظيم لتناول القهوة ، أو الذهاب في نزهة على الأقدام ، أو القيام بنشاط\r\nآخر يستمتع به كلاكما</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p class=\"MsoNormal\" align=\"right\" style=\"margin-bottom: 15pt; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:\r\n12.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-fareast-font-family:&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;\r\ncolor:#212529;mso-font-kerning:0pt;mso-ligatures:none\">إذا كنت تمر بفترة بطالة\r\nوتشعر بالوحدة نتيجة لذلك ، فقد تحتاج إلى أن تكون أكثر إصرارًا في تعزيز العلاقات\r\nالقائمة أو تكوين علاقات جديدة</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>.<o:p></o:p></span></p><p>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n<span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:12.0pt;line-height:107%;font-family:\r\n&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;mso-fareast-font-family:\r\n&quot;Times New Roman&quot;;mso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:\r\n0pt;mso-ligatures:none;mso-ansi-language:EN-US;mso-fareast-language:EN-US;\r\nmso-bidi-language:AR-SA\">إذا كنت ترغب في تكوين صداقات جديدة أو اتصالات اجتماعية\r\n، فإن الانضمام إلى نادٍ أو مجموعة فكرة رائعة. تحقق من مركز المجتمع المحلي\r\nلمعرفة ما إذا كانت هناك أي مجموعات قد تكون مهتمًا بها. وهناك خيار آخر هو</span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span style=\"font-size:12.0pt;line-height:\r\n107%;font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-bidi-font-family:&quot;Times New Roman&quot;;color:#212529;mso-font-kerning:0pt;\r\nmso-ligatures:none;mso-ansi-language:EN-US;mso-fareast-language:EN-US;\r\nmso-bidi-language:AR-SA\"><span dir=\"LTR\"></span><span dir=\"LTR\"></span>&nbsp;<a href=\"https://www.meetup.com/\" target=\"_blank\"><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-family:&quot;Times New Roman&quot;,serif;mso-ascii-font-family:Montserrat;\r\nmso-hansi-font-family:Montserrat;color:blue\">نلتقي</span></a><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span dir=\"LTR\"></span><span dir=\"LTR\"></span>&nbsp;- </span><span lang=\"AR-SA\" dir=\"RTL\" style=\"font-size:12.0pt;line-height:107%;font-family:&quot;Times New Roman&quot;,serif;\r\nmso-ascii-font-family:Montserrat;mso-fareast-font-family:&quot;Times New Roman&quot;;\r\nmso-hansi-font-family:Montserrat;color:#212529;mso-font-kerning:0pt;mso-ligatures:\r\nnone;mso-ansi-language:EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA\">موقع\r\nإلكتروني وتطبيق يجمع الأشخاص معًا على أساس الاهتمامات المشتركة</span><br></p>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-17T18:48:38.000000Z",
        "new": false
      },
      {
        "id": 13,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "مفهوم العلاقات الاجتماعية في القرآن الكريم",
        "description": "...",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-17T18:49:25.000000Z",
        "new": false
      },
      {
        "id": 14,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "كيف تحافظ على شحنة الايمان بعد رمضان؟",
        "description": "<div>كيف يمكن الاستمرار في الشعور بالإيمان بعد انتهاء شهر رمضان؟ يتساءل الكثير من الناس عن كيفية الحفاظ على حالة الإقبال على العبادة والشعور بالسعادة الروحية التي يختبرونها خلال رمضان، حيث يتمنون استمرار هذا الزخم الإيماني بعد انقضاء الشهر. شهر رمضان يتميز بروحانية فريدة تجعل المسلمين، رغم تنوع خلفياتهم، يشتركون في تجربة خاصة مع العبادة. ويعتبر الإنسان الحكيم من يستثمر رمضان كفرصة للتزود بالطاعات والاستعداد للعام القادم، مستذكرين قول النبي صلى الله عليه وسلم بأهمية الاستفادة من الفرص الروحية التي تقدمها الأيام. تحضيراً لرمضان، كان الصحابة يبدأون استعداداتهم قبل الشهر بستة أشهر ويقضون ستة أشهر في وداعه، مما يعني أنهم كانوا يعيشون في طاعة طوال العام.</div><div><br></div><div>لمن يأمل في الحفاظ على هذا الإيمان بعد رمضان، يجدر به معرفة أن استمرارية الطاعة تيسرها طاعة أخرى. إذا شاهد الله منك إقبالًا صادقًا، فإنه يسهل عليك الطريق لمزيد من القرب. إليك بعض الإرشادات للمساعدة في هذه العملية:</div><div><br></div><div>1- حرصاً على الاستمرار، من المهم الحفاظ على البيئة الروحية الإيجابية التي عشت فيها خلال رمضان، مثل مجالسة الصالحين والمشاركة في الفعاليات الدينية.</div><div>2- تقبل تفاوت الحالة الروحية، مع العلم أنه من الطبيعي أن يختلف مستوى الإيمان. المهم هو عدم اليأس أو الشعور بالفشل عند مقارنة حالك خارج رمضان بداخله.</div><div>3- حدد وردًا يوميًا من العبادات التي كنت تلتزم بها في رمضان وشعرت بأثرها الإيجابي، مثل قراءة القرآن بنفس الطريقة التي اعتدتها.</div><div>4- تواصل مع أصدقائك أو أقاربك الذين كانوا داعمين لك في رمضان للمواصلة سويًا في طريق الطاعة بعده.</div><div>5- بادر بصيام الست من شوال والأيام المباركة الأخرى، واستفد من المواسم الدينية كفرص لتجديد الإيمان.</div><div>6- زد من أعمال الخير مثل الصدقة، مستذكرًا حديث النبي صلى الله عليه وسلم الذي يؤكد أن الصدقة تطفئ الخطيئة كما يطفئ الماء النار.</div><div>7- شارك الآخرين ما تجرب من فضل ونور الطاعة، مما يعزز التزامك ويشجعك على الاستمرار في العبادة.</div><div>8- وأخيرًا، داوم على الدعاء والتضرع إلى الله طالبًا منه العون والتوفيق للحفاظ على نعمة الطاعة والقرب منه، مع الأمل في أن يجعل كل أيامك مشبعة بروحانية رمضان.</div><div><br></div><div>بهذه النصائح، يمكن للمؤمن أن يسعى للحفاظ على مستوى عالٍ من الإيمان والتقوى بعد رمضان. الحفاظ على شحنة الإيمان بعد رمضان ليس بالأمر السهل دائمًا، لكن بالإصرار والمثابرة والاستعانة بالله، يمكن تجديد هذا الشعور بالقرب من الله والعيش في رحاب طاعته طوال العام.</div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-17T20:00:12.000000Z",
        "new": false
      },
      {
        "id": 15,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "تأثير القلق على الحياة اليومية",
        "description": "<p>يعاني الكثير من الأشخاص من ضيق الوقت والانشغال الشديد بين العمل والمهام الأخرى مما يزيد من الضغط عليهم ويسبب التوتر والقلق وتكون النتيجة قلقًا وإجهادًا وهم وحزن على مختلف تفاصيل الحياة بشكل يؤثر على الصحة النفسية والجسدية ، وقد كان رسول الله ﷺ يُكثر من التعوذ منهما ويجمع بينهما فيقول :\"اللهم إني أعوذ بك من الهم والحزن\".</p><p><b>القلق</b> : هو شعور بعدم الارتياح ، مثل التوتر أو الخوف ، يمكن أن يكون خفيفًا أو شديدًا.</p><p><b>اضطراب القلق العام :</b> هي حالة طويلة الأمد تجعلك تشعر بالقلق حيال مجموعة واسعة من المواقف والقضايا ، بدلاً من حدث واحد محدد.</p><p>يمكن أن يسبب أعراضًا نفسية أو جسدية وقد يختلف من شخص لآخر لكن يشمل على:&nbsp;</p><p>&nbsp;• الشعور بالقلق أو التوتر .</p><p>&nbsp;• مواجهة صعوبة في التركيز أو النوم .</p><p>&nbsp;• الدوخة أو خفقان القلب .</p><p>&nbsp;• التركيز على الصُّعوبات أو التفكير في أيِّ أمرٍ .</p><p>&nbsp;• الشعور بالخطر الوَشيك أو الذُّعر أو التّشاؤم .</p><p><br></p><p><b>ماهي الأسباب وراء القلق؟&nbsp;</b></p><p>الأسباب كثيرة لكن أهمها قد يكون بسبب:</p><p>• فرط النشاط في مناطق الدماغ التي تشارك في المشاعر والسلوك .</p><p>• خلل في المواد الكيميائية في الدماغ مثل السيروتونين و النورادرينالين ، والتي تشارك في التحكم في المزاج وتنظيمه .</p><p>• الوراثة يُقدر أنك أكثر عرضة لإلصابة باضطراب القلق بخمس مرات إذا كان لديك قريب مقرب مصاب بهذه الحالة .&nbsp;</p><p>• وجود تاريخ من التجارب المجهدة أو المؤلمة ، مثل العنف الأسري أو إساءة معاملة الأطفال أو التنمر .</p><p>• الإصابة بحالة صحية مؤلمة طويلة الأمد .</p><p>• وجود تاريخ من تعاطي المخدرات أو الكحول .</p><p>• الكثير من الناس يصابون باضطراب القلق العام (GAD) دون سبب واضح .</p><p><br></p><p><b>كيف يمكن التحكم في القلق وعلاجه ؟!</b></p><p>طرق العلاج متعددة وتشمل :</p><p>• العلاجات النفسية : يمكنك الحصول على علاجات نفسية مثل العلاج السلوكي المعرفي (CBT)</p><p>• الأدوية : مثل نوع من مضادات الاكتئاب يسمى مثبطات امتصاص السيروتونين االنتقائية (SSRIS)</p><p><br></p><p>في الختام: لا يمكن إنكار أن القلق جزء أساسي من الحياة، وأن التوتر موجود في كل زاوية من الأنشطة اليومية، وقد لا تختفي مخاوفك من تلقاء نفسها، ويمكن أن تكون إدارته مهمة شاقة وتحتاج لاتباع خطة معينة للتغلب عليه.</p><p>فإذا شعرت أن القلق والتوتر يؤثر عليك ويعيق حياتك اليومية لا تتردد في التواصل مع معالجك النفسي عبر تطبيق تلبينة 🌱</p><p>لمُساعدتك في التغلب على القلق وعيش حياة نفسية جيدة ✨</p><p></p>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": false,
        "created_at": "2024-03-20T21:10:09.000000Z",
        "new": false
      },
      {
        "id": 18,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "كيف أتخلص من التفكير الزائد والتشتت؟",
        "description": "<p><font color=\"#003163\">عندما نواجه الإفراط في التفكير، يمكن أن يبدو عقلنا وكأنه أسوأ عدو لنا. تلك هي الأفكار المتكررة المشاكل التي نفكر فيها أكثر من اللازم تُرهقنا دون فائدة. ولكن هناك&nbsp;<span style=\"font-weight: 600;\">طرق للتخلص من التفكير الزائد، والحفاظ على صحتنا النفسية، وحمايتنا من الاضطرابات المختلفة.&nbsp;</span>فيما يلي بعض التوصيات والنصائح التي يمكن أن تساعدك:</font></p><p>&nbsp;<span style=\"font-weight: 600;\"><font color=\"#083139\">1. راقب نفسك واكتشف سبب المشكلة:</font></span><span style=\"color: rgb(0, 49, 99);\">&nbsp;</span>في المرة القادمة التي تشعر فيها بالتشتت، حاول أن ترى مدى تأثير ذلك على حالتك المزاجية ورفاهيتك العامة. هل تشعر بالغضب أو التوتر أو الذنب؟ حاول معرفة الشعور الأساسي وراء تلك الأفكار وما هو السبب الرئيسي وراءها. إن البدء في علاج أي مشكلة يتطلب التعرف على أسبابها.</p><p><font color=\"#083139\"><span style=\"font-weight: 600;\">2. ابحث عن طرق للتخلص من هذه الأفكار.</span>&nbsp;</font>هناك مجموعة متنوعة من التقنيات التي يمكن أن تساعدك على إبعاد عقلك عن الأفكار التي تسيطر عليك. ومن الأمثلة على هذه الأساليب: ممارسة التمارين الرياضية بانتظام، والمشاركة في مجموعة متنوعة من الأنشطة الاجتماعية، وتعزيز العلاقات مع العائلة والأصدقاء، وممارسة الهوايات والأنشطة التي تستمتع بها.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">3. جرب تمارين الاسترخاء والتأمل:</font>&nbsp;</span>تمارين الاسترخاء والتأمل لها فوائد جيدة للصحة النفسية والجسدية. يساعدك على محاربة القلق والتوتر، ويساعدك على التخلص من الأفكار المتكررة التي تعيقك عن طريق إعادة توجيه انتباهك إلى الداخل ونسيان المواقف المزعجة والقلق الذي تسببه.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">4. حدد أهدافًا واضحة وركز على الأولويات:</font></span>&nbsp;لا تسمح للمشاكل الصغيرة أن تتحول إلى عقبات كبيرة. فكر دائمًا في ما هو مهم بالنسبة لك وحدد الأولويات والأهداف الرئيسية. لا تدع الأفكار والعقبات الصغيرة تصرفك عن هدفك الرئيسي.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">5. مساعدة الآخرين والتعاون معهم:</font>&nbsp;</span>إن محاولة تخفيف أعباء الآخرين ومساعدتهم يمكن أن تساعدك على رؤية الأشياء في ضوء مختلف. فكر فيما يمكنك فعله لمساعدة شخص يمر بوقت عصيب. إن معرفة أن لديك القدرة على مساعدة الآخرين وتحسين حياتهم يمكن أن يمنع الأفكار السلبية من السيطرة على عقلك ويمنحك شيئًا مفيدًا للتركيز عليه بدلاً من الأفكار المتكررة.</p><p><font color=\"#083139\"><span style=\"font-weight: 600;\">6. تحديد الأفكار السلبية العشوائية والقضاء عليها.</span>&nbsp;</font>تثير هذه الأفكار السلبية العشوائية الخوف والغضب كرد فعل أولي على مواقف معينة. يمكنك التخلص منها باستخدام دفتر ملاحظات وتدوين المواقف التي تسبب لك القلق والتشتت. ثم حاول تحليل المشاعر التي تمر بها وتعلم كيفية التحدث مع نفسك خلال تلك المواقف. حاول إيجاد بديل للأفكار السلبية، على سبيل المثال فكر في الأشياء التي قد تسير على ما يرام بدلاً من الأشياء التي قد تفشل، وما إلى ذلك. الأول يولد الأمل والحماس، والثاني يولد الخوف واليأس.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">7. اعترف بنجاحاتك وكن ممتنًا لنفسك.&nbsp;</font></span>عندما تجد نفسك غارقًا في الأفكار السلبية، تذكر نجاحاتك وإنجازاتك، وركز على الجوانب الإيجابية في حياتك، مثل العمل والدراسة. احترام الذات والاهتمام بالنفس هو الخطوة الأولى في مواجهة أي اضطراب نفسي.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">8. حافظ على تركيزك.</font></span>&nbsp;الأفكار السلبية المتكررة تؤثر بشكل كبير على التركيز وتشتت الانتباه. لذا حاول أن تحافظ على تركيزك على المهام والأهداف الرئيسية، وتتخلص من الأفكار الثانوية التي تشتت ذهنك وتؤثر على أدائك في كافة جوانب حياتك.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">9. لا تتردد في طلب المساعدة عند الحاجة.&nbsp;</font></span>إذا كنت قد جربت التوصيات والنصائح السابقة ولم تلاحظ تحسناً ملحوظاً، أو إذا كان التفكير الزائد يؤثر سلباً على حالتك العامة، فلا تتردد في الاستعانة بالطبيب النفسي. فالأخصائيون هم الأكثر قدرة على تشخيص الحالة وتحديد أسبابها وتقديم العلاج المناسب. التفكير الزائد قد يضرك أكثر من نفعه، لذا حاول تطبيق التوصيات والنصائح السابقة ولا تتردد في طلب المساعدة المتخصصة عند الحاجة.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">10. ابق على مقربة من الأشخاص الإيجابيين.&nbsp;</font></span>يقال أن السعادة معدية، والحقيقة هي أننا نتأثر بشدة ببيئتنا. لذا، حاول أن تظل قريبًا من الأشخاص الإيجابيين والملهمين. ابحث عن الأشخاص الذين يساعدونك على التفكير بشكل إيجابي ويقدمون لك الدعم والتشجيع. - مارسي أنشطة اجتماعية مشتركة معهم، فتفاعلك معهم يمكن أن يساعدك في التخلص من الأفكار السلبية والمشتتات، ويعزز اندماجك في المجتمع.</p><p><span style=\"font-weight: 600;\"><font color=\"#083139\">11. لا تتردد في طلب المساعدة عند الضرورة.</font></span>&nbsp;إذا كنت قد جربت جميع التوصيات والنصائح السابقة ومازلت تعاني من كثرة التفكير وتأثيره السلبي على حياتك، فلا تتردد في طلب المساعدة المتخصصة. يتمتع المعالجون النفسيون والمهنيون في هذا المجال بالخبرة والمعرفة لمساعدتك في التعامل مع التفكير الزائد وتطوير استراتيجيات لتحسين صحتك العقلية. فلا تتردد في التواصل معهم والاستفادة من خبراتهم. باختصار، التخلص من التفكير الزائد يتطلب ممارسة الوعي، والاهتمام بحالتك النفسية، والعمل على تطبيق تقنيات التخلص من الأشياء الزائدة.</p>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/ron17iPkE1aysrr1sQJNqz5M1PljoPKh7c7ZvJxC.png",
        "is_bookmark": false,
        "created_at": "2024-05-27T11:18:52.000000Z",
        "new": false
      },
      {
        "id": 19,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "بين فرحة ولحظة حزن: أسرار تقلبات المزاج المفاجئة!",
        "description": "<p><b><font color=\"#003163\">تقلب المزاج المفاجئ</font></b></p><p>إن تقلب المزاج والشعور بالفرح في بعض الأحيان والحزن أو الغضب والتوتر في أوقات أخرى أمر طبيعي بشري، وينجم عن طبيعة الحياة ومتغيراتها وضغوطاتها. ومع ذلك، قد يثير التقلب المفاجئ والحاد للمزاج بعض التساؤلات.</p><p>أسباب تقلب المزاج المفاجئ تتراوح من الأسباب البسيطة التي لا تستدعي القلق، إلى الأسباب الطبية التي تتطلب استشارة طبية:</p><ol><li><p><font color=\"#083139\"><strong>التعب والإجهاد</strong>: </font>الضغوطات اليومية، سواء في العمل أو الدراسة أو الحياة الشخصية، قد تسبب تقلبات مفاجئة في المزاج نتيجة للإرهاق النفسي.</p></li><li><p><font color=\"#083139\" style=\"\"><strong style=\"\">الحساسية الموسمية</strong>:</font> الأعراض المصاحبة للحساسية مثل السعال المتكرر، والعطس، والحكة، قد تؤثر أيضًا على المزاج وتسبب تقلبات فيه.</p></li><li><p><font color=\"#083139\"><strong>اضطراب مستوى السكر</strong>:</font> تغيرات في مستوى السكر في الدم قد تؤدي إلى تقلبات مفاجئة في المزاج.</p></li><li><p><font color=\"#083139\"><strong>اضطرابات هرمونية</strong>: </font>مثل الاضطرابات التي تحدث خلال فترات مثل البلوغ أو سن اليأس، قد تسهم في تقلبات المزاج.</p></li><li><p><font color=\"#083139\"><strong>تأثير الأدوية</strong>:</font> بعض الأدوية قد تسبب آثارًا جانبية مثل تقلبات في المزاج، ويجب استشارة الطبيب قبل إجراء أي تغييرات في العلاج.</p></li></ol><p>أما الأسباب المرضية لتقلب المزاج المفاجئ، فتشمل:</p><ol><li><p><font color=\"#083139\"><strong>اضطرابات عقلية</strong>:</font> مثل اضطراب ثنائي القطب أو الاكتئاب الشديد، التي تتسم بتقلبات كبيرة في المزاج بين الفترات السعيدة والحزينة بشكل مفاجئ.</p></li><li><p><font color=\"#083139\"><strong>اضطرابات الشخصية</strong>:</font> مثل اضطراب الشخصية الحدية، الذي يمكن أن يؤدي إلى تقلبات حادة في المزاج بين القلق والغضب والاكتئاب.</p></li><li><p><font color=\"#083139\"><strong>أمراض أخرى</strong>:</font> مثل قصور الانتباه وفرط الحركة، القلق والتوتر المستمر، الخرف، وإدمان المخدرات.</p></li></ol><p>إن تقلب المزاج المفاجئ قد يكون رد فعل طبيعي على الأحداث اليومية، لكن عندما يكون مفرطًا أو مستمرًا بشكل غير عادي، ينبغي استشارة الطبيب لتقييم الحالة وتحديد العلاج المناسب إن لزم الأمر.</p>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/xeBI4dUsi8RSUZrEHSLlQnGtX887LPbcYrVhrYEz.jpg",
        "is_bookmark": false,
        "created_at": "2024-07-16T15:25:23.000000Z",
        "new": false
      },
      {
        "id": 20,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "نصائح للحد من تقلب المزاج المفاجئ",
        "description": "<p><b><font color=\"#003163\">إليك بعض النصائح التي يمكن أن تساعدك في الحفاظ على استقرار المزاج والتعامل مع تقلباته المفاجئة، خاصة إذا كانت الأسباب بسيطة:</font></b></p><ol><li><font color=\"#083139\"><strong>تجنب التوتر والإجهاد</strong>: </font>حاول تجنب الضغوطات اليومية والعملية بقدر الإمكان، وخصص وقتًا للاسترخاء والعناية بنفسك.</li><li><font color=\"#083139\"><strong>مارس هواياتك المفضلة</strong>: </font>استفد من أوقات الفراغ بممارسة الأنشطة التي تحبها، سواء كان ذلك بالخروج في نزهة أو قضاء وقت ممتع مع العائلة والأصدقاء.</li><li><font color=\"#083139\"><strong>التفكير الإيجابي</strong>:</font> ركز على الأمور الجيدة في حياتك وابتعد عن التقليل من شأن نفسك أو النقد الذاتي المفرط.</li><li><font color=\"#083139\"><strong>تناول طعامًا صحيًا</strong>: </font>احرص على نظام غذائي متوازن وغني بالفيتامينات والمعادن والألياف لتعزيز صحتك العامة.</li><li><font color=\"#083139\"><strong>ممارسة الرياضة</strong>: </font>حاول ممارسة التمارين الرياضية بانتظام، فهي تساهم في تحسين المزاج والحد من التوتر.</li><li><font color=\"#083139\"><strong>النوم الكافي</strong>: </font>تأكد من الحصول على قسط كافٍ من النوم للمساعدة في الحفاظ على توازن المزاج.</li><li><font color=\"#083139\"><strong>تجنب الكحول والتدخين</strong>: </font>حاول الابتعاد عن تناول المشروبات الكحولية والتدخين، حيث يمكن أن يؤثرا سلبًا على المزاج.</li><li><font color=\"#083139\"><strong>استشارة المختصين</strong>:</font> في حال شعرت بأعراض مرضية تؤثر على مزاجك، لا تتردد في مراجعة الأخصائيين للحصول على الدعم المناسب.</li></ol>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/rTU9Yb0TIuOhP7I3RbEmvC7wXEbaQJTyMPHOOL4O.jpg",
        "is_bookmark": false,
        "created_at": "2024-07-16T15:40:13.000000Z",
        "new": false
      },
      {
        "id": 21,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "التعلق المرضي: قيود العاطفة التي تعيق الحرية!",
        "description": "<h3><span style=\"font-family: Cairo; font-size: 13px;\">الحب والاهتمام والروابط العاطفية هي ما تجعلنا بشرًا، تعزز من إنسانيتنا وتضفي معنى على حياتنا. ولكن، ماذا يحدث عندما تتحول هذه الروابط إلى قيود خانقة؟ التعلق المرضي هو حالة نفسية تتجاوز حدود الحب والاهتمام الطبيعيين، لتصبح عائقًا كبيرًا أمام الحرية الشخصية والنمو الذاتي. في هذا المقال، سنستكشف أعماق التعلق المرضي، أسبابه، علاماته، وسبل التحرر منه.</span><br></h3><h4><font color=\"#003163\"><b>التعلق المرضي</b></font></h4><p>التعلق المرضي هو حالة نفسية يشعر فيها الفرد بارتباط عاطفي شديد وغير صحي تجاه شخص آخر. يمكن أن يكون هذا الشخص شريكًا رومانسيًا، صديقًا، أو حتى أحد أفراد العائلة. يتميز التعلق المرضي بالحاجة المفرطة للدعم العاطفي، الاعتماد الزائد على الآخر، والخوف الشديد من الفقدان أو الهجر.</p><h4><font color=\"#083139\">أسباب التعلق المرضي</font></h4><ol><li><strong>الطفولة والتجارب السابقة</strong>: التجارب العاطفية السلبية في الطفولة، مثل الإهمال أو فقدان الأحبة، قد تؤدي إلى تطوير أنماط تعلق غير صحية في المستقبل.</li><li><strong>انعدام الثقة بالنفس</strong>: عندما يفتقر الفرد إلى الثقة بنفسه، يميل إلى البحث عن الأمان والاعتراف من الآخرين بشكل مفرط.</li><li><strong>القلق والخوف من الفقدان</strong>: الأشخاص الذين يعانون من اضطرابات القلق غالبًا ما يخشون الفقدان أو الهجر، مما يعزز التعلق المرضي.</li></ol><h4><font color=\"#083139\">علامات التعلق المرضي</font></h4><ol><li><strong>الاعتماد العاطفي الزائد</strong>: الحاجة المستمرة للتواجد مع الشخص الآخر والحصول على طمأنينة مستمرة.</li><li><strong>الغيرة المفرطة</strong>: الشعور بالغيرة والشكوك بدون أسباب منطقية.</li><li><strong>التضحية بالذات</strong>: تجاهل احتياجاتك ورغباتك في سبيل إرضاء الشخص الآخر.</li><li><strong>الخوف من الانفصال</strong>: الشعور بالرعب من فكرة الانفصال أو الهجر.</li></ol><h4><font color=\"#083139\">آثار التعلق المرضي</font></h4><p>التعلق المرضي يمكن أن يؤدي إلى مجموعة من المشكلات النفسية والعاطفية. قد يشعر الفرد بفقدان هويته واستقلاله، ويعاني من التوتر والقلق المستمرين. كما يمكن أن يؤدي التعلق المرضي إلى تدهور العلاقات، حيث يشعر الطرف الآخر بالاختناق نتيجة للتوقعات والاحتياجات الزائدة.</p><h4><font color=\"#083139\">كيفية التحرر من التعلق المرضي</font></h4><ol><li><strong>الوعي الذاتي</strong>: أول خطوة للتحرر هي الوعي بوجود المشكلة وفهم جذورها. حاول التعرف على الأنماط السلبية في علاقاتك والبحث عن الأسباب الكامنة وراءها.</li><li><strong>بناء الثقة بالنفس</strong>: اعمل على تعزيز ثقتك بنفسك واستقلاليتك. شارك في أنشطة تعزز من قدراتك وتجعلك تشعر بالقوة والاكتفاء الذاتي.</li><li><strong>الاستقلال العاطفي</strong>: حاول تطوير علاقات صحية ومستقلة، واحترم مساحتك الشخصية واحتياجاتك.</li><li><strong>طلب المساعدة</strong>: إذا وجدت صعوبة في التعامل مع التعلق المرضي بمفردك، لا تتردد في طلب المساعدة من مستشار نفسي أو معالج متخصص.</li></ol><h4><span style=\"font-family: Cairo; font-size: 13px;\">التعلق المرضي هو حالة نفسية معقدة يمكن أن تؤثر سلبًا على حياتك وعلاقاتك. من خلال الوعي والجهد المستمر، يمكنك التحرر من قيود هذا التعلق وتطوير علاقات أكثر صحة وتوازنًا. تذكر دائمًا أن الحب الحقيقي يبدأ من حبك واحترامك لنفسك.</span><br></h4>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/5yMazSDhb0RA3K4frwh0rg6flOUypXiN98BSn9Uk.jpg",
        "is_bookmark": false,
        "created_at": "2024-07-16T17:18:42.000000Z",
        "new": false
      },
      {
        "id": 22,
        "article_category": {
          "id": 1,
          "name": "الحزن والقلق",
          "image": null,
          "created_at": "2023-09-06T22:12:08.000000Z"
        },
        "keywords": [],
        "title": "رحلة الحزن: مشاعرنا بين التأقلم والتجاوز ...",
        "description": "<h3><font color=\"#083139\"><b>رحلة الحزن: بين الفرح والاكتئاب</b></font></h3><h3><font color=\"#083139\"><b><br></b></font></h3><h3><font color=\"#083139\"><b><br></b></font></h3><h4><font color=\"#003163\"><b>الحزن الطبيعي والحزن غير المبرر</b></font></h4><p>الحزن شعور طبيعي يظهر على ملامحك، يلاحظه المقربون منك ويسألونك عن سببه. رغم أنك قد لا تجد تفسيرًا محددًا له هذه المرة، فإن الحزن هو رد فعل صحي للفقد، الإحباط، أو خيبة الأمل. يتلاشى عادةً مع تغير الظروف أو التكيف معها. ولكن، عندما يظهر الحزن دون سبب واضح، يبدو وكأنه ينبع من العدم.</p><p>الدكتور أنتونيس كوسوليس يوضح أننا مجهزون تطوريًا للشعور بمجموعة متنوعة من المشاعر، والحزن جزء منها. قد يكون الحزن بلا سبب واضح دليلًا على افتقادنا لشيء ما، ويعكس تاريخًا معقدًا من المشاعر.</p><h4><b><font color=\"#003163\">قيمة الحزن</font></b></h4><p>البحوث تشير إلى أهمية الحزن. دراسة في عام 2011 أظهرت أن الأشخاص الذين يتمتعون بمزاج سلبي يتحول مع الوقت إلى إيجابي يميلون لأن يكونوا أكثر انخراطًا في العمل ويتمتعون بعلاقات أقوى.</p><h4><b><font color=\"#003163\" style=\"\">الفرق بين الحزن والاكتئاب</font></b></h4><p>الحزن والاكتئاب ليسا مترادفين. الحزن عرض مؤقت قد يستمر لساعات أو أيام ويختفي من تلقاء نفسه. أما الاكتئاب فهو حالة صحية عقلية تستمر لأسبوعين أو أكثر وتتطلب تشخيصًا من مختص. يؤثر الاكتئاب على تفكيرنا وعواطفنا وسلوكياتنا، ولا يحتاج دائمًا إلى محفز خارجي.</p><h4><b><font color=\"#003163\">أعراض الاكتئاب</font></b></h4><p>تشمل الأعراض الشائعة للاكتئاب:</p><ul><li>الغضب والتهيج والقلق.</li><li>التعب وانخفاض الطاقة.</li><li>تغييرات في أنماط الأكل والنوم.</li><li>الشعور بالوحدة واليأس.</li><li>فقدان الاهتمام بالأنشطة المفضلة.</li><li>صعوبة التركيز واتخاذ القرارات.</li><li>أفكار إيذاء النفس أو الانتحار.</li></ul><h4><b><font color=\"#003163\">أسباب الحزن غير المبرر</font></b></h4><p>هناك عوامل عديدة قد تسبب الحزن دون سبب واضح، مثل:</p><ul><li>اجترار الأفكار والندم.</li><li>انعدام الاستقرار والأمان.</li><li>الاعتماد العاطفي على الآخرين.</li><li>العلاقات المسيئة.</li><li>الحساسية العالية والتعاطف الزائد.</li><li>الآثار الجانبية للأدوية.</li><li>التغيرات الهرمونية.</li></ul><h4><b><font color=\"#003163\">الحزن الموسمي</font></b></h4><p>قد يزيد الحزن في فصلي الخريف والشتاء بسبب قلة ضوء الشمس وطول الليالي الباردة، وهو ما يعرف بالاضطراب العاطفي الموسمي (SAD)، وهو نوع من الاكتئاب يرتبط بالتغيرات الموسمية.</p><h4><span style=\"font-size: 17.55px;\"><b><font color=\"#003163\">وأخيراً ...&nbsp;</font></b></span></h4><h4><span style=\"font-family: Cairo; font-size: 13px;\">من الطبيعي تمامًا أن تشعر بالحزن أحيانًا دون سبب واضح. قد يكون ذلك نتيجة لذكريات مضت أو تغييرات في البيئة من حولك. المفتاح هو فهم أن هذه المشاعر جزء من تجربتنا البشرية والسعي للتعامل معها بشكل صحي.</span><br></h4>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/Ap6QAAtvuikQJU89qlRf1p5fcgFActnkMmQrM2sC.jpg",
        "is_bookmark": false,
        "created_at": "2024-07-16T23:09:20.000000Z",
        "new": false
      },
      {
        "id": 23,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "العلاقات: مفتاح السعادة والصحة النفسية",
        "description": "<h3><b><font color=\"#083139\">قوة العلاقات: مفتاح الصحة النفسية والعقلية</font></b></h3><p>في عالم يتسارع بخطى لا تتوقف، نجد أنفسنا محاطين بتحديات وضغوطات لا تنتهي. وسط هذا الضجيج المستمر، تظهر العلاقات الإنسانية كملاذ آمن،<span style=\"font-family: Cairo;\">&nbsp;</span><span style=\"font-family: Cairo;\">تقدم لنا الدفء والراحة والدعم.</span></p><p><span style=\"font-family: Cairo;\"> العلاقات ليست مجرد تفاعل اجتماعي، بل هي أعمق بكثير، فهي تمدنا بالحب، الأمان، والشعور بالانتماء، وتلعب دورًا حاسمًا في تعزيز صحتنا النفسية والعقلية.</span></p><h4><b><font color=\"#003163\">العلاقات كبوابة للراحة النفسية</font></b></h4><p>العلاقات الإنسانية تضفي طابعًا خاصًا على حياتنا. في لحظات الحزن والفرح، نجد في الأصدقاء والعائلة من يقف بجانبنا، يقدم الدعم والراحة. </p><p>الدراسات أثبتت أن العلاقات القوية تقلل من مستويات القلق والتوتر، وتزيد من مشاعر السعادة والرضا. فعندما نشعر بأن هناك من يشاركنا أفراحنا وأحزاننا، نكتسب قوة داخلية تمكننا من مواجهة التحديات بشجاعة أكبر.</p><h4><b><font color=\"#003163\">أثر العلاقات على الصحة العقلية</font></b></h4><p>الصحة العقلية تتأثر بشكل مباشر بنوعية العلاقات التي نحظى بها. العلاقات الإيجابية تشجع على النمو الشخصي وتزيد من تقدير الذات. كما أن الدعم العاطفي المتبادل يساعد في تجاوز الأوقات الصعبة ويعزز من المرونة النفسية.</p><p> في المقابل، العلاقات السامة أو الفاترة يمكن أن تكون عبئًا ثقيلًا، تسهم في زيادة مستويات القلق والاكتئاب، وتضعف من قوة التحمل النفسي.</p><h4><b><font color=\"#003163\">العلاقات كداعم رئيسي في الأزمات</font></b></h4><p>خلال الأزمات، تكون العلاقات بمثابة الحصن الذي نحتمي به. الأزمات تكشف لنا قيمة الأشخاص في حياتنا، وتظهر أهمية وجود من يدعمنا بلا شروط أو توقعات.</p><p> هذا الدعم يمكن أن يكون الفارق بين الانهيار والصمود، بين الاستسلام والاستمرار. في تلك اللحظات، تتجلى قوة العلاقات في أبهى صورها، مؤكدة أن الحب والدعم يمكن أن يكونا أقوى من أي تحدي.</p><h4><b><font color=\"#003163\">بناء علاقات صحية</font></b></h4><p>بناء علاقات صحية يتطلب جهدًا واهتمامًا. يجب أن نكون مستعدين للاستماع والتفهم، وأن نقدم الدعم كما نتوقعه من الآخرين. العلاقات الصحية تقوم على الثقة والاحترام المتبادل، وتعزز من مشاعر الأمان والانتماء. </p><p>من المهم أن نكون قادرين على التفرقة بين العلاقات التي تبني وتدعم، وتلك التي تستنزف وتضعف، وأن نسعى دائمًا لتطوير علاقاتنا وتحسينها.</p><h4><b><font color=\"#003163\">الحب والدعم كعلاج</font></b></h4><p>في النهاية، الحب والدعم ليسا مجرد مشاعر عابرة، بل هما علاج نفسي وعقلي. العلاقات الجيدة تمدنا بالقوة، تدعمنا في أصعب الأوقات، وتمنح حياتنا معنى أعمق. فلنحرص على بناء علاقاتنا بكل حب واهتمام، ولنقدر الأشخاص الذين يملؤون حياتنا بالضوء والدفء. </p><p>العلاقات الإنسانية هي الأوكسجين الذي نتنفسه، النور الذي يرشدنا، والقوة التي تدفعنا للاستمرار.</p><p></p>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": "https://talbinahtest.s3.eu-central-1.amazonaws.com/articles-images/g8INlFywWoUKYgedjENHYcZD0AdjDwZ1HLZUq5nh.jpg",
        "is_bookmark": false,
        "created_at": "2024-07-16T23:26:46.000000Z",
        "new": false
      }
    ],
    "links": {
      "first": "https://redesign.talbinah.net/api/articles?page=1",
      "last": "https://redesign.talbinah.net/api/articles?page=2",
      "prev": null,
      "next": "https://redesign.talbinah.net/api/articles?page=2"
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 2,
      "links": [
        {
          "url": null,
          "label": "pagination.previous",
          "active": false
        },
        {
          "url": "https://redesign.talbinah.net/api/articles?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": "https://redesign.talbinah.net/api/articles?page=2",
          "label": "2",
          "active": false
        },
        {
          "url": "https://redesign.talbinah.net/api/articles?page=2",
          "label": "pagination.next",
          "active": false
        }
      ],
      "path": "https://redesign.talbinah.net/api/articles",
      "per_page": 15,
      "to": 15,
      "total": 25
    }
  }
};

export const mockFavoritesArticlesListing: IFavoritesArticlesListingResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "data": [
      {
        "id": 7,
        "article_category": {
          "id": 3,
          "name": "العلاقات",
          "image": null,
          "created_at": "2024-02-27T14:41:32.000000Z"
        },
        "keywords": [],
        "title": "كيف يؤثر الغذاء على الصحة النفسية ؟",
        "description": "<div style=\"text-align: justify;\"><font color=\"#262626\" face=\"Droid Arabic Kufi, sans-serif\"><span style=\"font-size: 18px;\">...</span></font></div>",
        "trending": 0,
        "original_trending": "غير شائعة",
        "image": null,
        "is_bookmark": true,
        "created_at": "2024-03-13T21:38:34.000000Z",
        "new": false
      },
    ],
    "links": {
      "first": "https://redesign.talbinah.net/api/bookmarks?page=1",
      "last": "https://redesign.talbinah.net/api/bookmarks?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "links": [
        {
          "url": null,
          "label": "pagination.previous",
          "active": false
        },
        {
          "url": "https://redesign.talbinah.net/api/bookmarks?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": null,
          "label": "pagination.next",
          "active": false
        }
      ],
      "path": "https://redesign.talbinah.net/api/bookmarks",
      "per_page": 15,
      "to": 15,
      "total": 15
    }
  }
};

export const mockMostViewedArticles: IMostViewedArticlesResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 9,
    "article_category": {
      "id": 3,
      "name": "العلاقات",
      "image": null,
      "created_at": "2024-02-27T14:41:32.000000Z"
    },
    "keywords": [],
    "title": "التلبينة النبوية فوائدها الروحية والصحية",
    "description": "<div>التلبينة النبوية تعتبر علاجًا تقليديًا موصى به نبويًا لتحسين الحالة النفسية والتخفيف من الاكتئاب، إلى جانب فوائدها الصحية الأخرى. تُصنع هذه الوجبة الغنية من الشعير المحمص المطحون مطهوًا مع الحليب ومُحلى بالعسل. هذا الحساء البسيط كان يُستخدم تقليديًا لتهدئة القلب وتخفيف الحزن.</div><div><br></div><div>تستخلص فوائد التلبينة النبوية في التقليل من الاكتئاب من خلال مكوناتها الغذائية الثرية، والتي تشمل:</div><div><br></div><div>• الكربوهيدرات:</div><div>&nbsp;تتميز التلبينة بمحتواها العالي من الكربوهيدرات، مما يساهم في تحسين المزاج والحالة النفسية عن طريق تعزيز إنتاج السيروتونين.</div><div>• الزنك:&nbsp;</div><div>&nbsp;المعدن الأساسي في التلبينة الذي يُعرف بتأثيره في تقليل أعراض الاكتئاب، حيث أظهرت الدراسات وجود علاقة بين نقص الزنك والإصابة بالاكتئاب.</div><div>• نسبة التربتوفان إلى الأحماض الأمينية متفرعة السلسلة (Trp: BCAA):&nbsp;</div><div>تتميز التلبينة بارتفاع هذه النسبة، مما يزيد من توافر التربتوفان للدماغ، ويساهم في تحسين الصحة العقلية وتقليل الإصابة بالاكتئاب.</div><div><br></div><div>طريقة تحضير التلبينة النبوية:</div><div>• المكونات:</div><div>&nbsp; &nbsp;- 375 ملليليتر من الماء (حوالي كوبين ونصف).</div><div>&nbsp; &nbsp;- 125 غرام من الشعير المطحون (حوالي ربع كوب).</div><div>&nbsp; &nbsp;- 2.5 لتر من الحليب الطازج.</div><div>&nbsp; &nbsp;- ربع كوب من العسل.</div><div>&nbsp; &nbsp;- قليل من المكسرات (اختياري).</div><div><br></div><div>• التحضير:</div><div>&nbsp; &nbsp;- نظف الشعير جيدًا واتركه يجف تمامًا.</div><div>&nbsp; &nbsp;- بعد الجفاف، احمص الشعير ثم اغليه مع الماء.</div><div>&nbsp; &nbsp;- بعد الغليان، اترك الخليط ليبرد ثم صفيه.</div><div>&nbsp; &nbsp;- في كوب، ضع ملعقتين كبيرتين من خليط الشعير وأضف إليها الحليب البارد.</div><div>&nbsp; &nbsp;- أضف العسل وزينها بالمكسرات إن أردت وقدمها باردة.</div><div><br></div><div>هذه الطريقة تضمن الحصول على أقصى فوائد من التلبينة النبوية للتخفيف من الاكتئاب ودعم الصحة النفسية.</div><div><br></div>",
    "trending": 0,
    "original_trending": "غير شائعة",
    "image": null,
    "is_bookmark": false,
    "created_at": "2024-03-13T21:43:10.000000Z",
    "new": false
  }
};

export const mockToggleFavoriteArticle: IToggleFavoriteArticleResponseDto = {
  "status": true,
  "message": null,
  "data": {
    "id": 9,
    "article_category": {
      "id": 3,
      "name": "العلاقات",
      "image": null,
      "created_at": "2024-02-27T14:41:32.000000Z"
    },
    "keywords": [],
    "title": "التلبينة النبوية فوائدها الروحية والصحية",
    "description": "<div>التلبينة النبوية تعتبر علاجًا تقليديًا موصى به نبويًا لتحسين الحالة النفسية والتخفيف من الاكتئاب، إلى جانب فوائدها الصحية الأخرى. تُصنع هذه الوجبة الغنية من الشعير المحمص المطحون مطهوًا مع الحليب ومُحلى بالعسل. هذا الحساء البسيط كان يُستخدم تقليديًا لتهدئة القلب وتخفيف الحزن.</div><div><br></div><div>تستخلص فوائد التلبينة النبوية في التقليل من الاكتئاب من خلال مكوناتها الغذائية الثرية، والتي تشمل:</div><div><br></div><div>• الكربوهيدرات:</div><div>&nbsp;تتميز التلبينة بمحتواها العالي من الكربوهيدرات، مما يساهم في تحسين المزاج والحالة النفسية عن طريق تعزيز إنتاج السيروتونين.</div><div>• الزنك:&nbsp;</div><div>&nbsp;المعدن الأساسي في التلبينة الذي يُعرف بتأثيره في تقليل أعراض الاكتئاب، حيث أظهرت الدراسات وجود علاقة بين نقص الزنك والإصابة بالاكتئاب.</div><div>• نسبة التربتوفان إلى الأحماض الأمينية متفرعة السلسلة (Trp: BCAA):&nbsp;</div><div>تتميز التلبينة بارتفاع هذه النسبة، مما يزيد من توافر التربتوفان للدماغ، ويساهم في تحسين الصحة العقلية وتقليل الإصابة بالاكتئاب.</div><div><br></div><div>طريقة تحضير التلبينة النبوية:</div><div>• المكونات:</div><div>&nbsp; &nbsp;- 375 ملليليتر من الماء (حوالي كوبين ونصف).</div><div>&nbsp; &nbsp;- 125 غرام من الشعير المطحون (حوالي ربع كوب).</div><div>&nbsp; &nbsp;- 2.5 لتر من الحليب الطازج.</div><div>&nbsp; &nbsp;- ربع كوب من العسل.</div><div>&nbsp; &nbsp;- قليل من المكسرات (اختياري).</div><div><br></div><div>• التحضير:</div><div>&nbsp; &nbsp;- نظف الشعير جيدًا واتركه يجف تمامًا.</div><div>&nbsp; &nbsp;- بعد الجفاف، احمص الشعير ثم اغليه مع الماء.</div><div>&nbsp; &nbsp;- بعد الغليان، اترك الخليط ليبرد ثم صفيه.</div><div>&nbsp; &nbsp;- في كوب، ضع ملعقتين كبيرتين من خليط الشعير وأضف إليها الحليب البارد.</div><div>&nbsp; &nbsp;- أضف العسل وزينها بالمكسرات إن أردت وقدمها باردة.</div><div><br></div><div>هذه الطريقة تضمن الحصول على أقصى فوائد من التلبينة النبوية للتخفيف من الاكتئاب ودعم الصحة النفسية.</div><div><br></div>",
    "trending": 0,
    "original_trending": "غير شائعة",
    "image": null,
    "is_bookmark": false,
    "created_at": "2024-03-13T21:43:10.000000Z",
    "new": false
  }
};
