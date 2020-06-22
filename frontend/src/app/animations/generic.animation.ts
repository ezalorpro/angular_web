import {
    animation, trigger, animateChild, group,
    transition, animate, style, query, useAnimation
} from '@angular/animations';

export const FadeIn = animation([
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
]);

export const FadeOut = animation([
    style({ opacity: 1 }),
    animate('300ms', style({ opacity: 0 }))
]);

export const TranslateIn = animation([
    style({ transform: "translateX(100%)" }),
    animate('300ms', style({ transform: "translateX(0)" }))
]);

export const TranslateOut = animation([
    style({ transform: "translateX(0)" }),
    animate('300ms', style({ transform: "translateX(100%)" }))
]);

export function FadeInOutAnimation(
    FadeInTime: string = '300ms',
    FadeOutTime: string = '300ms',
    selector: string = 'fadeInOutAnimation') {
    return trigger(
        selector, [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(FadeInTime, style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate(FadeOutTime, style({ opacity: 0 }))
            ])
        ]
    )
}
// export const FadeInOutAnimation = trigger(
//     'enterAnimation', [
//         transition(':enter', [
//             style({ opacity: 0 }),
//             animate('300ms', style({ opacity: 1 }))
//         ]),
//         transition(':leave', [
//             style({ opacity: 1 }),
//             animate('300ms', style({ opacity: 0 }))
//         ])
//     ]
// )