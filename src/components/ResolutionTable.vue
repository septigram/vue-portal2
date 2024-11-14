<script setup lang="ts">
import { ref, computed } from 'vue';
import SeptCollapse from './SeptCollapse.vue';

const showMajor = ref(true);
const resolutions = [
{label:"QQVGA (Quarter QVGA)",width:160,height:120,aspect:"0.16875",major:false,description:"代表例：2002年ごろまでの携帯電話"},
{label:"QCIF (Quarter CIF)",width:176,height:144,aspect:"0.16875",major:false,description:"代表例：2003年ごろまでの携帯電話"},
{label:"QVGA (Quarter VGA)",width:320,height:240,aspect:"0.16875",major:false,description:"代表例：2002年ごろの携帯電話、2011年2月に任天堂が発売した携帯型ゲーム機「ニンテンドー3DS」（下画面）"},
{label:"CGA (Color Graphics Adapter)",width:640,height:200,aspect:"8:5 (16:10)",major:false,description:"IBM PC, IBM PC XTのグラフィック用ビデオアダプタ。同じ解像度はPC-98/88 200ライン など。"},
{label:"HVGA (Half VGA)",width:480,height:320,aspect:"0.126388888888889",major:false,description:"VGAの横が半分になった規格。"},
{label:"Mac 9″ gray",width:512,height:342,aspect:"約3:2",major:false,description:"（一体型パソコン）Appleが発売した「Macintosh 128K」の9型モノクロCRT"},
{label:"Mac 9″ color",width:512,height:384,aspect:"0.16875",major:false,description:""},
{label:"EGA (Enhanced Graphics Adapter)",width:640,height:350,aspect:"0.16875",major:false,description:"IBM PC AT標準のビデオ規格。MDA, CGAの上位互換。"},
{label:"PC-98",width:640,height:400,aspect:"8:5 (16:10)",major:true,description:"代表例：Apple Macintosh Portableおよび初代PowerBook、J-3100、FMR-50など"},
{label:"X68000 16bit",width:512,height:512,aspect:"0.0423611111111111",major:false,description:"SHARP X68000 の65,536色カラーモードでの表示画面解像度"},
{label:"VGA (Video Graphics Array)",width:640,height:480,aspect:"0.16875",major:true,description:"IBM PS/2で採用のビデオ規格。MDA, CGA, EGA, MCGA 上位互換。DOS/Vでサポート。単に640x480解像度の通称としても使われている。同一の解像度はAX (JEGA)など。"},
{label:"WVGA (Wide VGA)",width:800,height:480,aspect:"5:3 (15:9)",major:false,description:"代表例：2006年ごろの携帯電話"},
{label:"FWVGA (Full Wide VGA)",width:854,height:480,aspect:"427:240",major:false,description:"代表例：（日本の携帯電話、液晶）2007年4月23日にNTTドコモが発表した日本電気製「N904i」の3型"},
{label:"FWVGA++ (Full Wide VGA++)",width:960,height:480,aspect:"2:1 (18:9)",major:false,description:"（日本の携帯電話、液晶）2009年5月25日にKDDIと東芝が発表した東芝製「biblio (TSY01)」の3.5型"},
{label:"SVGA (Super-VGA)",width:800,height:600,aspect:"0.16875",major:true,description:"VGA上位互換ビデオ規格の総称。日本ではDOS/V初期のハイテキスト (V-text) などでサポート。"},
{label:"UWVGA (Ultra Wide VGA)",width:1024,height:480,aspect:"32:15 （約21:9）",major:false,description:"代表例：1998年9月19日にソニーが発売したノートパソコン「VAIO C1 (PCG-C1)」の8.9型液晶[13]"},
{label:"HXGA (Half XGA)",width:1024,height:480,aspect:"32:15 （約21:9）",major:false,description:"（日本の携帯電話、液晶）2008年10月30日にソフトバンクモバイルが発表したシャープ製「AQUOSケータイ FULLTOUCH SoftBank 931SH」の3.8型"},
{label:"qHD (Quarter HD)",width:960,height:540,aspect:"0.672916666666667",major:false,description:"代表例：スマートフォン"},
{label:"Mac 16″",width:832,height:624,aspect:"0.16875",major:false,description:""},
{label:"Mac 15″",width:640,height:870,aspect:"64:87 （約3:4）",major:false,description:""},
{label:"WSVGA (Wide Super VGA)",width:1024,height:600,aspect:"128:75 （約17:10）",major:false,description:"代表例：低価格帯ネットブック"},
{label:"DoubleVGA",width:960,height:640,aspect:"0.126388888888889",major:false,description:"HVGAの縦と横が2倍になった規格。"},
{label:"iPhone 4",width:1136,height:640,aspect:"2.98611111111111",major:false,description:"16:9より短方向が1画素多い。"},
{label:"UWSVGA (Ultra Wide SVGA)",width:1280,height:600,aspect:"32:15 （約21:9）",major:false,description:"代表例：VAIO C1、リブレットの一部機種"},
{label:"XGA (eXtended Graphics Array)",width:1024,height:768,aspect:"0.16875",major:true,description:"IBM PS/2後期のビデオ規格。8514/Aに由来し、MDA, CGA, MCGA, EGA, VGA 上位互換。単に1024x768解像度の通称としても使われている。"},
{label:"PC-98 ハイレゾモード",width:1120,height:750,aspect:"112:75 （約3:2）",major:false,description:"他、FMR-60・70のモード"},
{label:"HD (720p)",width:1280,height:720,aspect:"0.672916666666667",major:false,description:"欧米の第一世代のデジタル放送・デジタルテレビにおいて一般的な解像度である。代表例：2011年ごろからのスマートフォン（4インチクラス）"},
{label:"WXGA (Wide XGA)",width:1280,height:768,aspect:"5:3 (15:9)",major:false,description:"代表例：B5サイズ程度のノートパソコンやネットブック"},
{label:"XGA+",width:1152,height:864,aspect:"0.16875",major:false,description:""},
{label:"iPhone 4.7″",width:1334,height:750,aspect:"667:375",major:false,description:"16:9には短方向に0.375ピクセル足りない。"},
{label:"Mac 21″",width:1152,height:870,aspect:"192:145 （約4:3）",major:false,description:"Two-Page（A4判2枚を並べて表示できるサイズ）"},
{label:"WXGA (Wide XGA)",width:1280,height:800,aspect:"8:5 (16:10)",major:true,description:"2006年ごろからのノートパソコン（14 - 15型クラス）の主流。2009年ごろよりFWXGAへ移行。"},
{label:"FWXGA (Full-WXGA)",width:1366,height:768,aspect:"683:384",major:true,description:"16:9には縦方向に0.375ピクセル足りない。ピクセル数が2の20乗をわずかに超える。"},
{label:"HD+",width:1520,height:720,aspect:"0.797916666666667",major:false,description:"スマートフォン、6.3型液晶。「ASUS ZenFone Max (M2)」"},
{label:"HD+",width:1600,height:720,aspect:"0.839583333333333",major:false,description:"スマートフォン、6.5型液晶。「OPPO A5 2020」"},
{label:"Ultra Wide XGA",width:1600,height:768,aspect:"25:12 （約21:10）",major:false,description:"代表例：2009年1月8日にソニーが発表したノートパソコン「VAIO Type P」の8型液晶[19]"},
{label:"QVGA (Quad VGA)",width:1280,height:960,aspect:"0.16875",major:false,description:""},
{label:"WXGA+ (Wide XGA+)",width:1440,height:900,aspect:"8:5 (16:10)",major:false,description:"2000年代初頭以降、各社ノートパソコンや、一体型パソコンの液晶で採用される。"},
{label:"SXGA (Super XGA)",width:1280,height:1024,aspect:"0.211111111111111",major:true,description:"2000年代中盤の17-20インチのディスプレイに多く採用された。"},
{label:"HD+",width:1600,height:900,aspect:"0.672916666666667",major:false,description:""},
{label:"SXGA+",width:1400,height:1050,aspect:"0.16875",major:false,description:"各社のノートパソコンに採用される。"},
{label:"HD+",width:1792,height:828,aspect:"約19.5:9",major:false,description:"スマートフォン、6.1型液晶。「iPhone XR、iPhone 11」"},
{label:"WSXGA",width:1600,height:1024,aspect:"25:16(約16:10)",major:false,description:""},
{label:"WSXGA+",width:1680,height:1050,aspect:"8:5 (16:10)",major:false,description:"各社ノートパソコンに採用される。辺の長さが縦横ともにWUXGAとWXGA+の中間。"},
{label:"WSXGA (Wide Super XGA)",width:1600,height:1024,aspect:"25:16 （約16:10）",major:false,description:"代表例：（ブラウン管ディスプレイ）1996年10月にソニーが発表した24型「GDM-W900」で表示可能な解像度の一つ[21]"},
{label:"UXGA (Ultra XGA)",width:1600,height:1200,aspect:"0.16875",major:true,description:"各社ノートパソコンに採用される。"},
{label:"DCI 2K",width:2048,height:1080,aspect:"256:135 （約17:9）",major:false,description:"映画のデジタル撮影規格として有名。"},
{label:"WUXGA (Wide Ultra-XGA)",width:1920,height:1200,aspect:"8:5 (16:10)",major:true,description:"（ブラウン管ディスプレイ）1996年10月にソニーが発表した24型「GDM-W900」で表示可能な解像度の一つ[21]"},
{label:"QWXGA",width:2048,height:1152,aspect:"0.672916666666667",major:false,description:"（液晶ディスプレイ）2008年11月17日に日本サムスンが発表した23型「SyncMaster 2343BW」[27]"},
{label:"FHD+",width:1920,height:1280,aspect:"0.126388888888889",major:false,description:"（タブレット、液晶）2015年3月31日にマイクロソフトが発表した「Surface 3」の10.8型"},
{label:"QHD (Quad HD)",width:2160,height:1440,aspect:"0.126388888888889",major:false,description:"（タブレット、液晶）2014年5月にマイクロソフトが発表したタブレット「Surface Pro 3」の12型"},
{label:"FHD+",width:2160,height:1080,aspect:"18:9 (2:1)",major:false,description:"スマートフォン、5型液晶。「SONY Xperia Ace」"},
{label:"FHD+",width:2312,height:1080,aspect:"約19.3:9",major:false,description:"スマートフォン、約6.15型液晶。「Huawei P30 lite」"},
{label:"FHD+",width:2340,height:1080,aspect:"19.5:9",major:false,description:"スマートフォン、6.65型有機EL。「OPPO Reno 10x Zoom」"},
{label:"FHD+",width:2520,height:1080,aspect:"0.88125",major:false,description:"スマートフォン、6.1型有機EL。「SONY Xperia 5」"},
{label:"FHD+",width:2436,height:1125,aspect:"約19.5:9",major:false,description:"スマートフォン、5.8型有機EL。「iPhone XS、iPhone 11 Pro」"},
{label:"UltraWide FHD",width:2560,height:1080,aspect:"64:27=4^3:3^3",major:false,description:"アスペクト比16:9よりも横幅が広いウルトラワイドモニターで採用される。"},
{label:"UltraWide FHD",width:2560,height:1080,aspect:"64:27=4^3:3^3",major:false,description:"FHDより左右320ピクセルずつ計640ピクセル横に広い。"},
{label:"QXGA (Quad XGA)",width:2048,height:1536,aspect:"0.16875",major:false,description:"VGA端子の出力の規格上の最大解像度(設計上はフレームレート60Hzでは2560×1600まで表示できるが、QXGAを超える解像度でのVGAの採用はごくわずか)。"},
{label:"MacBook 12″",width:2304,height:1440,aspect:"8:5 (16:10)",major:false,description:"（ノートパソコン、液晶）2015年3月に発表された「MacBook」の12型。（ブラウン管ディスプレイ）2000年7月20日にソニーが発売した24型「GDM-FW900」[32]、同社の旧モデル「GDM-W900」、およびヒューレットパッカードの「HP A7217A」で表示可能な最大の解像度"},
{label:"FHD+",width:2688,height:1242,aspect:"約19.5:9",major:false,description:"スマートフォン、6.5型有機EL。「iPhone XS Max、iPhone 11 Pro Max」"},
{label:"2K",width:2256,height:1504,aspect:"0.126388888888889",major:false,description:"（液晶ディスプレイ）[33]"},
{label:"WQHD (Wide Quad-HD),1440p",width:2560,height:1440,aspect:"0.672916666666667",major:true,description:"単にQHDというとこの画質を指すことも多い。画素数がHD(Full HDとは異なる)の四倍で、縦横のピクセル数は共にHDの二倍。（ノートパソコン、液晶）2013年4月18日に東芝が発表した「dynabook KIRA V832」の13.3型"},
{label:"FHD Square",width:1920,height:1920,aspect:"0.0423611111111111",major:false,description:"（液晶ディスプレイ）2014年12月18日にEIZOが発表した26.5型「EV2730Q」[34]"},
{label:"WQXGA",width:2560,height:1600,aspect:"8:5 (16:10)",major:false,description:"（液晶ディスプレイ）2004年6月29日にアップルが発表した30型「Apple Cinema HD Display A1083」"},
{label:"Full Vision QHD",width:2880,height:1440,aspect:"2:1 (18:9)",major:false,description:"（スマートフォン、液晶）2017年2月7日にLGが発表した「G6」"},
{label:"Dual FHD",width:3840,height:1080,aspect:"1.33958333333333",major:false,description:"（液晶ディスプレイ）2019年5月にエイスースが発売した49型「ROG Strix XG49VQ」[36]"},
{label:"2K Square",width:2048,height:2048,aspect:"0.0423611111111111",major:false,description:"（液晶ディスプレイ）2008年5月1日にEIZOが航空管制市場向けに発売した28.05型「SQ2801」[37]および「SQ2802」[38]に搭載"},
{label:"2.5K QHD",width:2520,height:1680,aspect:"0.126388888888889",major:false,description:"（液晶ディスプレイ）[33]"},
{label:"WQHD+",width:2960,height:1440,aspect:"37:18 (18.5:9)",major:false,description:"（スマートフォン、液晶）2017年3月30日にSamsungが発表した「Galaxy S8」"},
{label:"Pixel A5",width:2560,height:1800,aspect:"64:45 (約:√2:1)",major:false,description:"（タブレット、液晶）2015年9月30日にgoogleが発表した「Pixel C」の10.2型、A5規格用紙に近似させた"},
{label:"3K",width:2880,height:1620,aspect:"0.672916666666667",major:false,description:"（ノートパソコン、液晶）2013年12月7日にソニーが発売した「VAIO Fit 15A」の15.5型"},
{label:"Ultra-Wide QHD (UWQHD)",width:3440,height:1440,aspect:"43:18 (21.5:9)",major:false,description:"アスペクト比16:9よりも横幅が広いウルトラワイドモニターで採用される。"},
{label:"Surface 12.3″",width:2736,height:1824,aspect:"0.126388888888889",major:false,description:"（タブレット、液晶）2015年10月6日にMicrosoftが発表したSurface Pro 4"},
{label:"3K (QHD+)",width:3008,height:1692,aspect:"0.672916666666667",major:false,description:"4Kディスプレイの疑似解像度での表示など[40]。"},
{label:"QWXGA+ (Quad WXGA+)",width:2880,height:1800,aspect:"8:5 (16:10)",major:false,description:"（ノートパソコン、液晶）2012年6月12日にAppleが発表した「MacBook Pro」の一部モデルの15.4型"},
{label:"QSXGA (Quad SXGA)",width:2560,height:2048,aspect:"0.211111111111111",major:false,description:"（液晶パネル）2002年10月29日にNECが発表した20.1型[41]"},
{label:"iPad Pro 12.9″",width:2732,height:2048,aspect:"683:512 (約4:3)",major:false,description:"4:3より短方向が1画素足りない"},
{label:"QHD+ (Quad HD+)",width:3200,height:1800,aspect:"0.672916666666667",major:false,description:"（液晶パネル）2013年6月にシャープが生産開始したノートPC向け14・15.6インチ[42]"},
{label:"Surface 13.5″",width:3000,height:2000,aspect:"0.126388888888889",major:false,description:"（タブレット、液晶）2015年10月6日にMicrosoftが発表したSurface Book"},
{label:"UltraWide QHD+",width:3840,height:1600,aspect:"21:9 (7:3)",major:false,description:"通常のモニターよりも横幅が広いウルトラワイドモニターで採用される。"},
{label:"UltraWide QHD+",width:3840,height:1644,aspect:"0.88125",major:false,description:"スマートフォン、6.5型有機EL。「SONY Xperia 1」"},
{label:"Dual WQHD",width:5120,height:1440,aspect:"1.33958333333333",major:false,description:"（液晶ディスプレイ）2018年10月にデルが発売した49型「U4919DW」[45]"},
{label:"QUXGA (Quad UXGA)",width:3200,height:2400,aspect:"0.16875",major:false,description:"（液晶ディスプレイ）2000年11月16日に東芝が発表した20.8型[46]"},
{label:"4K",width:3840,height:2160,aspect:"0.672916666666667",major:true,description:"（業務用液晶ディスプレイ）2007年4月に東芝ライテックが発売した56型「P56QHD」[48]"},
{label:"DCI 4K[注 2]",width:4096,height:2160,aspect:"256:135 （約17:9）",major:false,description:"2009年5月に発表されたHDMI 1.4の最大解像度。映画のデジタル撮影規格として有名。"},
{label:"WQUXGA (Wide QUXGA)",width:3840,height:2400,aspect:"8:5 (16:10)",major:false,description:"デュアルリンク DVI-D 出力の最大解像度"},
{label:"iMac Retina 4K",width:4096,height:2304,aspect:"0.672916666666667",major:false,description:"（一体型パソコン、液晶）2015年10月13日にAppleが発表した「iMac Retina 4Kディスプレイモデル」の21.5型"},
{label:"4K+",width:3840,height:2560,aspect:"0.126388888888889",major:false,description:"（液晶ディスプレイ）2022年3月18日にファーウェイが発売した「HUAWEI MateView 28 Standard Edition」[53]"},
{label:"DCI 4K+",width:4096,height:2560,aspect:"8:5 (16:10)",major:false,description:"（業務用液晶ディスプレイ）2014年1月にキヤノンが発売した30型「DP-V3010」[54]"},
{label:"5K",width:5120,height:2160,aspect:"64:27=4^3:3^3（約21:9=7:3）",major:false,description:"（液晶ディスプレイ）2021年1月にデル・テクノロジーズが発売した39.7インチ「U4021QW」[55]"},
{label:"iMac Retina 4.5K",width:4480,height:2520,aspect:"0.672916666666667",major:false,description:"(一体型パソコン、液晶)2021年4月20日にAppleが発表した「新しい24インチiMac」[56]"},
{label:"Dual 4k",width:7680,height:2160,aspect:"1.33958333333333",major:false,description:"（液晶ディスプレイ）2024年9月にエイサーが発売した57.1型「U4021QW」[57]"},
{label:"5K",width:5120,height:2880,aspect:"0.672916666666667",major:false,description:"縦横のドット数がWQHDの2倍になった規格であり、qHDの5倍(＝FHDの2.5倍)ではない。縦横の長さが4Kの5/4倍よりも大きい4/3倍になっている。"},
{label:"6K",width:6016,height:3384,aspect:"0.672916666666667",major:false,description:"2019年6月3日にAppleが発表したMac Pro用の32型「Pro Display XDR」"},
{label:"8K FUHD (4320p)",width:7680,height:4320,aspect:"0.672916666666667",major:true,description:"（業務用液晶ディスプレイ）2014年6月にアストロデザインが発売した98型[59]"},
{label:"8K",width:8192,height:4320,aspect:"256:135 （約17:9）",major:false,description:"（プロジェクタ）2009年5月に日本ビクターが発表[61]"},
{label:"10K",width:10240,height:4320,aspect:"64:27 （約21:9）",major:false,description:"2017年1月に発表されたHDMI 2.1の最大解像度。上下方向のピクセル数は8Kテレビと同一である一方、左右方向のピクセル数が多くなっている。その結果、縦横比がHD/Full-HD/4K/8Kと比べてさらに横長で、シネスコープに近い。"},
{label:"16K",width:15360,height:4320,aspect:"1.33958333333333",major:false,description:"2019年4月に16Kディスプレイをソニービジネスソリューションが納入[62]。"},
{label:"16K",width:15360,height:8640,aspect:"0.672916666666667",major:false,description:"2019年6月に発表されたDisplayPort2.0の最大解像度。"},
];

const filteredResolutions = computed(() => {
    return resolutions.filter((resolution) => !showMajor.value || resolution.major);
});

</script>

<template>
    <sept-collapse title="解像度" :isOpen="false" :showHeader="true" :state="false">
        <template #header>
            <el-checkbox v-model="showMajor" label="主要な解像度のみ表示" />
        </template>
        <el-table :data="filteredResolutions">
            <el-table-column prop="label" label="通称" width="200"/>
            <el-table-column prop="width" label="横(px)"/>
            <el-table-column prop="height" label="縦(px)"/>
            <el-table-column prop="description" label="備考" width="300"/>
        </el-table>
    </sept-collapse>
</template>


