/*
==============================================================================================================
作成者:dimebag29 (Author:dimebag29)

このプログラムのライセンスはCC0 (クリエイティブ・コモンズ・ゼロ)です。いかなる権利も保有しません。
(This program is licensed under CC0 (Creative Commons Zero). No rights reserved.)
https://creativecommons.org/publicdomain/zero/1.0/
==============================================================================================================
*/

Shader "ComplementaryColorAfterimage"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Saturation ("彩度", Range(0, 2)) = 1.25
        [Toggle] _SW ("スイッチ", Float) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            sampler2D _MainTex;
            float _Saturation;
            float _SW;


            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float3 col = tex2D(_MainTex, i.uv).rgb;

                // 色残効変換
                if (0.5 > _SW)
                {
                    //--------------------------------------------------
                    // 基準輝度 (50%グレー)
                    //--------------------------------------------------
                    float targetL = 128.0 / 255.0;
                    
                    //--------------------------------------------------
                    // Linear → sRGB
                    //--------------------------------------------------
                    col = pow(saturate(col), 1.0 / 2.2);

                    //--------------------------------------------------
                    // 輝度
                    //--------------------------------------------------
                    float l = (col.r * 0.299) + (col.g * 0.587) + (col.b * 0.114);

                    //--------------------------------------------------
                    // 輝度との差
                    //--------------------------------------------------
                    float3 d = col - l;

                    //--------------------------------------------------
                    // 最大・最小差分
                    //--------------------------------------------------
                    float maxD = max(d.r, max(d.g, d.b));
                    float minD = min(d.r, min(d.g, d.b));

                    //--------------------------------------------------
                    // 圧縮係数
                    //--------------------------------------------------
                    float s = 1.0;
                    if (0.0 < maxD){ s = min(s, (1.0 - targetL) / maxD); }
                    if (0.0 > minD){ s = min(s, (0.0 - targetL) / minD); }

                    //--------------------------------------------------
                    // RGB再合成
                    //--------------------------------------------------
                    col = targetL + (s * d);

                    //--------------------------------------------------
                    // ネガポジ反転
                    //--------------------------------------------------
                    col = 1.0 - col;

                    //--------------------------------------------------
                    // 彩度調整
                    //--------------------------------------------------
                    float gray = dot(col, float3(0.299, 0.587, 0.114));
                    col = lerp(gray.xxx, col, _Saturation);

                    //--------------------------------------------------
                    // sRGB → Linear
                    //--------------------------------------------------
                    col = pow(saturate(col), 2.2);
                }

                // グレースケール変換
                else
                {
                    col = (col.r + col.g + col.b) / 3.0;        // グレースケール化
                }

                return fixed4(col, 1.0);
            }
            ENDCG
        }
    }
}
