module Api exposing (..)

import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Page.Candidates exposing (Candidate)


login : (Result Http.Error String -> msg) -> { a | email : String, password : String } -> Cmd msg
login msg payload =
    Http.post
        { url = "/api/auth/login"
        , body = Http.jsonBody (Encode.object [ ( "email", Encode.string payload.email ), ( "password", Encode.string payload.password ) ])
        , expect = Http.expectJson msg (Decode.at [ "token" ] Decode.string)
        }


fetchCandidates : (Result Http.Error (List Candidate) -> msg) -> { a | token : String } -> Cmd msg
fetchCandidates msg payload =
    Http.request
        { method = "GET"
        , headers =
            [ Http.header "Authorization" ("Bearer " ++ payload.token)
            ]
        , url = "/api/candidates"
        , body = Http.emptyBody
        , expect = Http.expectJson msg Page.Candidates.candidatesDecoder
        , timeout = Nothing
        , tracker = Nothing
        }
