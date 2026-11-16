import { NextResponse } from "next/server";

export async function POST(request) {
  const { text } = await request.json();

  const res = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DOUBAO_API_KEY}`,
    },
    body: JSON.stringify({
      model: "doubao-seed-2-1-lite-260915",
      messages: [
        {
          role: "system",
          content:
            '你是记账助手。把用户的一句话解析成账单，'+
            '只输出JSON，格式：{"type":"收入或支出","amount":数字,"note":"简短备注开销事项，别带时间"}。'+
            '如果无法从用户的话中提取出账单信息，输出：{"error":"这句话里没有找到账单信息，请换个说法"}。'+
            '禁止输出JSON以外的任何文字。',
        },
        { role: "user", content: text },
      ],
    }),
  });

  const data = await res.json();

  // res.ok = HTTP 状态码是 2xx；!data.choices = 响应结构不对（Key无效/网址错）
  if(!res.ok||!data.choices){
    return NextResponse.json({
      error:"AI服务调用失败："+(data?.error?.message||res.status)
    })
  }

  try{
    console.log("豆包返回：", JSON.stringify(data, null, 2)); 
    const bill = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(bill);
  }catch(e){
    return NextResponse.json({error:"AI返回了意外格式，请重试！"});
  }
  
  
  
}
