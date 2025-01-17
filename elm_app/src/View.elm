module View exposing (layout)

import Html.Styled exposing (Html, a, button, div, img, nav, span, text)
import Html.Styled.Attributes exposing (alt, attribute, class, href, src, type_)
import Html.Styled.Events exposing (onClick)
import View.Icons as Icons


layout : { a | onLogout : msg } -> Html msg -> Html.Styled.Html msg
layout config content =
    div
        [ class "bg-gray-white h-screen flex antialiased" ]
        [ mobileMenu config
        , div
            [ class "hidden sm:flex lg:flex-shrink-0" ]
            [ div [ class "flex flex-col sm:w-14 lg:w-64" ] [ sideMenu config ] ]
        , content
        ]


mobileMenu : { a | onLogout : msg } -> Html msg
mobileMenu config =
    div
        -- TODO: Implement open/close mobile menu
        [ class "hidden fixed inset-0 flex z-40 lg:hidden", attribute "role" "dialog", attribute "aria-modal" "true" ]
        [ div
            [ class "fixed inset-0 bg-gray-600 bg-opacity-75", attribute "aria-hidden" "true" ]
            []
        , div
            [ class "relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white" ]
            [ div
                [ class "absolute top-0 right-0 -mr-12 pt-2" ]
                [ button
                    [ type_ "button", class "ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" ]
                    [ span
                        [ class "sr-only" ]
                        [ text "Close sidebar" ]
                    , Icons.close
                    ]
                ]
            , div
                [ class "flex-shrink-0 flex items-center px-4" ]
                [ img
                    [ class "h-8 w-auto", src "/illustrations/beta-gouv-logo-a3.png", alt "BetaGouv - Reva" ]
                    []
                , text "REVA"
                ]
            , div
                [ class "mt-5 flex-1 h-0 overflow-y-auto" ]
                [ nav
                    [ class "px-2 space-y-1" ]
                    [ a
                        [ href "#", class "text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md" ]
                        [ Icons.candidates
                        , text "Candidats"
                        ]
                    , button
                        [ onClick config.onLogout, class "bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md" ]
                        [ Icons.signout
                        , text "Déconnexion"
                        ]
                    ]
                ]
            ]
        , div
            -- Force sidebar to shrink to fit close icon
            [ class "flex-shrink-0 w-14", attribute "aria-hidden" "true" ]
            []
        ]


sideMenu : { a | onLogout : msg } -> Html msg
sideMenu config =
    div
        [ class "flex-1 flex flex-col flex-grow min-h-0 border-r border-gray-200 pt-5 bg-gray-100 overflow-y-auto" ]
        [ div
            [ class "flex flex-col items-center justify-center lg:justify-start lg:flex-row items-start flex-shrink-0 px-4" ]
            [ img
                [ class "h-4 lg:h-8 w-auto", src "/illustrations/beta-gouv-logo-a3.png", alt "BetaGouv - Reva" ]
                []
            , span [ class "font-bold lg:ml-2 text-xs lg:text-base" ] [ text "REVA" ]
            ]
        , div
            [ class "mt-5 flex-grow flex flex-col" ]
            [ nav
                [ class "flex-1 px-2 pb-4 space-y-1" ]
                [ a
                    [ href "#", class "bg-gray-200 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md" ]
                    [ Icons.candidates
                    , span [ class "hidden lg:block" ] [ text "Candidats" ]
                    ]
                , button
                    [ onClick config.onLogout, class "w-full text-gray-900 group flex items-center px-2 py-2 text-sm font-base hover:font-medium rounded-md" ]
                    [ Icons.signout
                    , span [ class "hidden lg:block" ] [ text "Déconnexion" ]
                    ]
                ]
            ]
        ]
