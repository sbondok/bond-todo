(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const v=document.querySelector(".DarkThemeToggle"),u=document.querySelector(".App"),p=document.querySelector(".TaskSearchBar__input"),a=document.querySelector(".TaskList__list"),l=document.querySelector(".TaskList__link");document.querySelector(".TaskSearchBar__button");const _=document.querySelector("#task-form"),h=document.querySelector("#progress-fill"),L=document.querySelector("#progress-text"),T=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),c=t=>{const e=localStorage.getItem(t);if(!e)return t==="tasks"?[]:!1;try{return JSON.parse(e)}catch{return t==="tasks"?[]:!1}},f=(t,e)=>{localStorage.setItem(t,JSON.stringify(e))},w=()=>{u&&(u.classList.toggle("App--isDark"),f("darkModeFlag",u.classList.contains("App--isDark")))},S=t=>{if(!h||!L)return;const e=t.length,s=t.filter(n=>n.isCompleted).length,r=e===0?0:Math.round(s/e*100);h.style.width=`${r}%`,L.textContent=`${s} من ${e} مهام مكتملة (${r}%)`},C=t=>{if(!a)return;let e="";t.forEach((s,r)=>{e+=`
    <li class="TaskList__taskContent${s.isCompleted?" TaskList__taskContent--isActive":""}" data-index="${r}">
      <div class="TaskList__checkbox" tabindex="0" role="button" aria-label="تحديد المهمة كمكتملة" data-index="${r}">
        <svg class="TaskList__checkboxIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="TaskList__valueContent">
        <span class="TaskList__value" tabindex="0" title="انقر مزدوجاً للتعديل" data-index="${r}">
          ${T(s.value)}
        </span>
      </div>
      <div class="TaskList__actions">
        <button class="TaskList__actionBtn TaskList__actionBtn--edit" data-index="${r}" aria-label="تعديل المهمة">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="TaskList__actionBtn TaskList__actionBtn--delete" data-index="${r}" aria-label="حذف المهمة">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>`}),a.innerHTML=e,p&&(p.value="",p.focus())},M=()=>{a&&(a.innerHTML=`
    <li class="EmptyList">
      <svg class="EmptyList__img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <p class="EmptyList__text">قائمة المهام فارغة تماماً</p>
      <p class="EmptyList__subtext">أضف مهمتك الأولى بالأعلى للبدء في التخطيط ليومك!</p>
    </li>`)},d=t=>{t&&t.length?C(t):M(),S(t)},E=t=>{if(t.preventDefault(),!p)return;const e=p.value.trim();if(!e)return;const s={value:e,isCompleted:!1},r=c("tasks");r.push(s),f("tasks",r),d(r)},x=t=>{if(!confirm("هل أنت متأكد من رغبتك في حذف هذه المهمة؟"))return;const s=c("tasks");s.splice(t,1),f("tasks",s),d(s)},y=t=>{const e=c("tasks");e[t]&&(e[t].isCompleted=!e[t].isCompleted,f("tasks",e),d(e))},N=(t,e)=>{const s=c("tasks"),r=e.trim();if(!r){x(t);return}s[t].value=r,f("tasks",s),d(s)},A=()=>{c("darkModeFlag")&&u&&u.classList.add("App--isDark");const e=c("tasks");d(e)},b=(t,e)=>{var m;const s=e.parentElement;if(!s)return;const r=((m=e.textContent)==null?void 0:m.trim())||"",n=document.createElement("input");n.type="text",n.className="TaskList__valueInput",n.value=r,n.setAttribute("data-index",t.toString()),s.innerHTML="",s.appendChild(n),n.focus(),n.select();let o=!1;const i=()=>{o||(o=!0,N(t,n.value))},g=()=>{o||(o=!0,d(c("tasks")))};n.addEventListener("blur",i),n.addEventListener("keydown",k=>{k.key==="Enter"?(k.preventDefault(),i()):k.key==="Escape"&&(k.preventDefault(),g())})},B=()=>{v==null||v.addEventListener("click",w),_&&_.addEventListener("submit",E),l==null||l.addEventListener("click",()=>{a==null||a.classList.toggle("TaskList__list--hideCompleted"),l==null||l.classList.toggle("TaskList__link--isActive")}),a==null||a.addEventListener("click",t=>{const e=t.target,s=e.closest(".TaskList__checkbox");if(s){const o=parseInt(s.getAttribute("data-index")??"",10);isNaN(o)||y(o);return}const r=e.closest(".TaskList__actionBtn--delete");if(r){const o=parseInt(r.getAttribute("data-index")??"",10);isNaN(o)||x(o);return}const n=e.closest(".TaskList__actionBtn--edit");if(n){const o=parseInt(n.getAttribute("data-index")??"",10),i=n.closest("li"),g=i==null?void 0:i.querySelector(".TaskList__value");!isNaN(o)&&g&&b(o,g);return}}),a==null||a.addEventListener("dblclick",t=>{const s=t.target.closest(".TaskList__value");if(s){const r=parseInt(s.getAttribute("data-index")??"",10);isNaN(r)||b(r,s)}}),a==null||a.addEventListener("keydown",t=>{const s=t.target.closest(".TaskList__checkbox");if(s&&(t.key==="Enter"||t.key===" ")){t.preventDefault();const r=parseInt(s.getAttribute("data-index")??"",10);isNaN(r)||y(r)}})};A();B();
