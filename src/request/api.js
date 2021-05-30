import { get, post } from "./http"

/* --------菜单管理-------- */
//菜单添加
export const reqMenuadd = params => post("/api/menuadd", params)
//菜单列表
export const reqMenulist = params => get("/api/menulist", params)
//菜单查询一条
export const reqMenuinfo = params => get("/api/menuinfo", params)
//菜单修改
export const reqMenuedit = params => post("/api/menuedit", params)
//菜单删除
export const reqMenudelete = params => post("/api/menudelete", params)

/* --------角色管理-------- */
//角色添加
export const reqroleadd = params => post("/api/roleadd", params)
//角色列表
export const reqrolelist = () => get("/api/rolelist")
//角色查询一条
export const reqroleinfo = params => get("/api/roleinfo", params)
//角色修改
export const reqroleedit = params => post("/api/roleedit", params)
//角色删除
export const reqroledelete = params => post("/api/roledelete", params)

/* --------管理员管理-------- */
//管理员添加
export const requseradd = params => post("api/useradd", params)
//管理员总数
export const requsercount = () => get("/api/usercount")
//管理员列表 （分页）
export const requserlist = params => get("/api/userlist", params)
//管理员获取 一条
export const requserinfo = params => get("/api/userinfo", params)
//管理员修改
export const requseredit = params => post("/api/useredit", params)
//管理员删除
export const requserdelete = params => post("/api/userdelete", params)
//管理员登录
export const requserlogin = params => post("/api/userlogin", params)

/* --------会员管理-------- */
//会员列表
export const reqmemberlist = params => get("/api/memberlist", params)
//会员获取 一条
export const reqmemberinfo = params => get("/api/memberinfo", params)
//会员修改
export const reqmemberedit = params => post("/api/memberedit", params)

/* --------商品分类-------- */
//分类添加
export const reqcateadd = params => post("/api/cateadd", params, true)
//分类列表
export const reqcatelist = params => get("/api/catelist", params)
//获取分类列表一条
export const reqcateinfo = params => get("/api/cateinfo", params)
//分类修改
export const reqcateedit = params => post("/api/cateedit", params, true)
//分类删除
export const reqcatedelete = params => post("/api/catedelete", params)


/* --------商品规格-------- */
//商品规格添加
export const reqspecsadd = params => post("/api/specsadd", params)
//商品规格总数
export const reqspecscount = () => get("/api/specscount")
//商品规格列表（分页）
export const reqspecslist = params => get("/api/specslist", params)
//商品规格获取 一条
export const reqspecsinfo = params => get("/api/specsinfo", params)
//商品规格修改
export const reqspecsedit = params => post("/api/specsedit", params)
//商品规格删除
export const reqspecsdelete = params => post("/api/specsdelete", params)

/* --------商品管理-------- */
//商品管理添加
export const reqgoodsadd = params => post("/api/goodsadd", params, true)
//商品管理总数
export const reqgoodscount = () => get("/api/goodscount")
//商品管理列表（分页）
export const reqgoodslist = params => get("/api/goodslist", params)
//商品管理获取 一条
export const reqgoodsinfo = params => get("/api/goodsinfo", params)
//商品管理修改
export const reqgoodsedit = params => post("/api/goodsedit", params, true)
//商品管理删除
export const reqgoodsdelete = params => post("/api/goodsdelete", params)

/* --------轮播图管理-------- */
//轮播图添加
export const reqbanneradd = params => post("/api/banneradd", params, true)
//轮播图列表
export const reqbannerlist = params => get("/api/bannerlist", params)
//获取轮播图列表一条
export const reqbannerinfo = params => get("/api/bannerinfo", params)
//轮播图修改
export const reqbanneredit = params => post("/api/banneredit", params, true)
//轮播图删除
export const reqbannerdelete = params => post("/api/bannerdelete", params)

/* --------限时秒杀-------- */
//限时秒杀添加
export const reqseckadd = params => post("/api/seckadd", params)
//限时秒杀列表
export const reqsecklist = () => get("/api/secklist", )
//获取限时秒杀列表一条
export const reqseckinfo = params => get("/api/seckinfo", params)
//限时秒杀修改
export const reqseckedit = params => post("/api/seckedit", params)
//限时秒杀删除
export const reqseckdelete = params => post("/api/seckdelete", params)